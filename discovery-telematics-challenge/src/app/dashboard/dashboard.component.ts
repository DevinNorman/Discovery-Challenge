import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { recordingData, recording } from '../models/recording';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  @ViewChild('mapContainer', { static: false }) gmap: ElementRef;
  Lat; Long;
  map: google.maps.Map;
  marker: google.maps.Marker;
  heatmap;
  recordings: recordingData[] = [];
  recordingsAsync: Observable<recordingData[]>;
  currentRecording: recordingData = null;

  points: any[];
  loading = true;

  displayedColumns: string[] = ['name', 'createdDate', 'items', 'select'];

  ngOnInit() {
    
  }

  ngAfterViewInit() {
    this.recordingsAsync = this.db.collection("recordings")
      .get().pipe(map(c => {
        const list: recordingData[] = [];
        c.docs.forEach(item => {
          const obj = item.data() as recordingData;
          list.push(obj);
        });
        return list;
      }));

    this.recordingsAsync
      .subscribe((data) => {
        this.recordings = data;
      }, err => {
        console.log(err);
      }, () => {
        this.Lat = -26.113084, this.Long = 28.052945;
        this.mapInitializer();
      });
  }

  constructor(private db: AngularFirestore) { }

  makeData(rec: recordingData): void {
    let avLon = 0, avLat = 0, count = 0;
    let map = new Map<string, { location: google.maps.LatLng, weight: number }>();

    for (let item of rec.recordings) {
      if (item.lon == 0 && item.lat == 0 || item.lon == null || item.lat == null) continue;

      let lon = +item.lon.toFixed(3);
      let lat = +item.lat.toFixed(3);

      let key = lon.toString() + "-" + lat.toString();
      if (map.get(key) != null) {
        map.get(key).weight++;
      } else {
        map.set(key, { location: new google.maps.LatLng(lat, lon), weight: 1 });
      }
      avLon += item.lon;
      avLat += item.lat;
      count++;
    }

    this.points = Array.from(map.values());
    this.Lat = avLat / count;
    this.Long = avLon / count;
  }

  mapInitializer() {
    const coordinates = new google.maps.LatLng(this.Lat, this.Long);
    this.marker = new google.maps.Marker({ position: coordinates, map: this.map })
    // check here to get to know about map options docs                       
    const mapOptions: google.maps.MapOptions = {
      // here to place centering our location based on coordinates                                         
      center: coordinates,
      zoom: 12,
      fullscreenControl: false,
      mapTypeControl: true,
      streetViewControl: false
    };
    //set our lovely google maps here and marker here
    this.map = new google.maps.Map(this.gmap.nativeElement, mapOptions);
    this.marker.setMap(this.map);

    this.loading = false;
  }

  toggleHeatmap(): void {
    this.heatmap.setMap(this.heatmap.getMap() ? null : this.map);
  }


  changeGradient(): void {
    var gradient = [
      'rgba(0, 255, 255, 0)',
      'rgba(0, 255, 255, 1)',
      'rgba(0, 191, 255, 1)',
      'rgba(0, 127, 255, 1)',
      'rgba(0, 63, 255, 1)',
      'rgba(0, 0, 255, 1)',
      'rgba(0, 0, 223, 1)',
      'rgba(0, 0, 191, 1)',
      'rgba(0, 0, 159, 1)',
      'rgba(0, 0, 127, 1)',
      'rgba(63, 0, 91, 1)',
      'rgba(127, 0, 63, 1)',
      'rgba(191, 0, 31, 1)',
      'rgba(255, 0, 0, 1)'
    ]
    this.heatmap.set('gradient', this.heatmap.get('gradient') ? null : gradient);
  }

  changeRadius(): void {
    this.heatmap.set('radius', this.heatmap.get('radius') ? null : 20);
  }

  changeOpacity(): void {
    this.heatmap.set('opacity', this.heatmap.get('opacity') ? null : 0.2);
  }

  changeMap(recording: recordingData): void {
    this.currentRecording = recording;

    this.points = [];
    this.makeData(recording);

    if (this.heatmap == null) {
      this.heatmap = new google.maps.visualization.HeatmapLayer({
        data: this.points,
        map: this.map
      });
    } else {
      this.heatmap.setData(this.points);
    }


    this.heatmap.set('radius', 40);
    this.heatmap.set('opacity', 1);
  }

  getNumberOfDevices(): string {
    if (this.currentRecording == null) return null;
    let groups = this.groupBy<recording>(this.currentRecording.recordings, record => record.deviceId);

    let devices = Array.from(groups.keys());

    return devices.length > 0 ? devices.length.toString() : "unknown";
  }

  getMinDate(): string {
    if (this.currentRecording == null) return null;
    let groups = this.groupBy<recording>(this.currentRecording.recordings, record => record.serverTime);
    let times = Array.from(groups.keys());
    let min:Date = null;
    times.forEach(c => {
      if (c != null && c != '' && (min == null || min > new Date(c))) min = new Date(c);
    });
    return min != null ? min.toString() : "unknown";
  }

  //This can obviously be refactored to get both min and max. This is done for speed of dev.
  getMaxDate(): string {
    if (this.currentRecording == null) return null;
    let groups = this.groupBy<recording>(this.currentRecording.recordings, record => record.serverTime);
    let times = Array.from(groups.keys());
    let max:Date = null;
    times.forEach(c => {
      if (c != null && c != '' && (max == null || max < new Date(c))) max = new Date(c);
    });
    return max != null ? max.toString() : "unknown";
  }

  groupBy<T>(list: T[], keyGetter: (obj: T) => {}): Map<string, T[]> {
    const map = new Map();
    list.forEach((item) => {
      const key = keyGetter(item);
      const collection = map.get(key);
      if (!collection) {
        map.set(key, [item]);
      } else {
        collection.push(item);
      }
    });
    return map;
  }
}

//https://medium.com/@ndreznotanto/making-google-maps-using-angular-component-angular-google-maps-47f31c4d947d
//https://developers.google.com/maps/documentation/javascript/heatmaplayer