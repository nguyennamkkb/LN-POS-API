export class UserCommon {
    static maxId: number = 0;
    static getUrlProFile(so: number): string {
      const chuoiSoPhu = [
        "y",
        "3",
        "n",
        "S",
        "S",
        "J",
        "y",
        "x",
        "8",
        "g",
        "t",
        "Y",
        "t",
        "7",
        "9",
        "p",
        "W",
        "R",
        "M",
        "t",
        "O",
        "1",
        "E",
        "s",
        "d",
        "x",
        "O",
        "Y",
        "W",
        "u",
        "g",
        "K",
        "g",
        "9",
        "w",
        "R",
        "C",
        "F",
        "e",
        "G",
      ];
      const chuoiSo = ["h", "P", "b", "B", "o", "5", "l", "6", "r", "z"];
  
      let chuoi = "";
      let soString = so.toString();
  
      for (let i = 0; i < soString.length; i++) {
        let chiSo = parseInt(soString[i]);
        chuoi += chuoiSo[chiSo];
      }
  
      while (chuoi.length < 10) {
        chuoi = chuoiSoPhu[Math.floor(Math.random() * chuoiSoPhu.length)] + chuoi;
      }
      return chuoi;
    }
    static async verifyEmail(email: string): Promise<boolean> {
      if (email.match(/[^\s@]+@[^\s@]+\.[^\s@]+/gi)) {
        return true;
      } else {
        return false;
      }
    }
  
    static async parseJwt(token: string): Promise<AccessJWT> {
      return JSON.parse(Buffer.from(token.split(".")[1], "base64").toString()) as AccessJWT;
    }
  }
  class AccessJWT {
    role:number; // quyen
    id2: string;  //id user
    id: string; //url profile
    email: string;
    time: string;
    key: string;
  }