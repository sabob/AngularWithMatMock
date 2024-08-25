export default class StringUtils {

  static isEmpty(str: string) {

    if (str == null) return true;

    if (typeof str === 'string') {
      return (0 === str.trim().length);
    }
    return false;
  }

  static isNotEmpty(str: string) {
    return !this.isEmpty(str);
  }

  static trim(str: string) {
    if (typeof str === 'string')
      if (this.isNotEmpty(str)) {
        return str.trim();
      }
    return str;
  }
}
