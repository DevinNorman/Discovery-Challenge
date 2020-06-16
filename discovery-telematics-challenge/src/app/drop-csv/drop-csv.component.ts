import { Component, OnInit } from '@angular/core';
import { NgxFileParserConfig, INgxResult } from 'ngx-file-parser';
import { recording, recordingData } from '../models/recording';
import { AngularFirestore, DocumentReference, QueryFn } from '@angular/fire/firestore';


@Component({
  selector: 'app-drop-csv',
  templateUrl: './drop-csv.component.html',
  styleUrls: ['./drop-csv.component.css']
})
export class DropCsvComponent implements OnInit {
  public loading: boolean = false;
  public uploading: boolean = false;
  public ngxFileParserConfig: NgxFileParserConfig = {
    btnText: "Upload",
    btnIcon: "backup",
    btnColor: "primary",
    accepts: [".csv"],
    csvNamedProperties: true,
  };

  constructor(private db: AngularFirestore) { }

  ngOnInit(): void {
  }

  handleParsedFile(obj: INgxResult): void {
    const res = obj.result;
    const data: any[] = res as any[];

    //make sure it is what is expected
    if (data.length <= 0) {
      alert("Error parsing file...");
      return;
    }

    let recordings: recording[] = [];
    const result = new recordingData();
    for (let item of data) {
      try {
        if (item["serverTime"] == null || item["phoneTime"] == null || item["deviceId"] == null || item["lat"] == null || item["lon"] == null || item["acc"] == null || item["speed"] == null || item["ts"] == null) continue;
        recordings.push(new recording(item));
      } catch (error) {
        alert(error);
        return;
      }
    }
    result.recordings = recordings;
    result.name = obj.extension;
    if (result.recordings.length > 0) {
      this.saveData(result);
    } else {
      this.loading = false;
      alert("There was an error with the file. I told you not to upload.... SMH")
    }
  }

  saveData(result: recordingData): void {
    this.uploading = true;
    this.db.collection("recordings").add(JSON.parse(JSON.stringify(result))).finally(() => { this.uploading = false; alert("Upload successful... Well done...") });
  }

  processing(processing: boolean): void {
    this.loading = processing;
  }
}