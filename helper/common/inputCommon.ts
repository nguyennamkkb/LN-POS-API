export class InputCommon {
  static async checkEmail(email: any): Promise<boolean> {
    try {
      if (email == null || email == undefined || email == "") {
        return false;
      }
      const regex =
        /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
      return regex.test(email);
    } catch (error) {
      return false;
    }
  }

  static async checkInputNormal(items: any[]): Promise<boolean> {
    try {
      var status: boolean = false;
      for (let index = 0; index < items.length; index++) {
        const element = items[index];
        if (element == null || element == undefined || element == "") {
          status = false;
          break
        }else {
          status = true;
        }
      }
      return status
    } catch (error) {
      return false;
    }
  }
}
