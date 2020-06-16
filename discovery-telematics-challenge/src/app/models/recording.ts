export class recording {
    public serverTime: Date;
    public phoneTime: Date;
    public deviceId: string;
    public lat: number;
    public lon: number;
    public acc: number;
    public speed: number;
    public ts: Date | null;

    constructor(obj: any) {
        //I would add some form of validation here to make sure the data is correct;
        this.serverTime = new Date(obj["serverTime"]);
        this.phoneTime = new Date(obj["phoneTime"]);
        this.deviceId = obj["deviceId"];
        this.lat = +obj["lat"];
        this.lon = +obj["lon"];
        this.acc = +obj["acc"];
        this.speed = +obj["speed"];
        this.ts = obj["ts"] == "0" ? null : new Date(obj["ts"]);
    }
}

export class recordingData {
    public recordings: recording[] = [];
    public createdDate: Date = new Date();
    public name: string;

    constructor(){}
}