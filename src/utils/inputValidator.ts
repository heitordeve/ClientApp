export function validateCPF(val: string) {
  let result: boolean = false;

  try {

    switch (val) {
      case '00000000000':
        break;
      case '11111111111':
        break;
      case '22222222222':
        break;
      case '33333333333':
        break;
      case '44444444444':
        break;
      case '55555555555':
        break;
      case '66666666666':
        break;
      case '77777777777':
        break;
      case '88888888888':
        break;
      case '99999999999':
        break;
      default:
        if (val.length === 11) {
          //1st validation number
          let r1: number = (parseInt(val[0]) * 10) + (parseInt(val[1]) * 9) + (parseInt(val[2]) * 8) +
            (parseInt(val[3]) * 7) + (parseInt(val[4]) * 6) + (parseInt(val[5]) * 5) +
            (parseInt(val[6]) * 4) + (parseInt(val[7]) * 3) + (parseInt(val[8]) * 2);

          let r2: number = (r1 * 10) % 11;
          r2 = r2 === 10 ? 0 : r2;

          if (r2 === parseInt(val[9])) {
            //2nd validation number
            r1 = (parseInt(val[0]) * 11) + (parseInt(val[1]) * 10) + (parseInt(val[2]) * 9) +
              (parseInt(val[3]) * 8) + (parseInt(val[4]) * 7) + (parseInt(val[5]) * 6) + (parseInt(val[6]) * 5) +
              (parseInt(val[7]) * 4) + (parseInt(val[8]) * 3) + (r2 * 2);

            r2 = (r1 * 10) % 11;
            r2 = r2 === 10 ? 0 : r2;

            if (r2 === parseInt(val[10])) {
              result = true;
            }

          }

        }
        break;
    }

  } catch (error) {
    result = false;
  }

  return result;
}

export function validateCNPJ(val: string) {
  let result: boolean = false;

  try {

    switch (val) {
      case '00000000000000':
        break;
      case '11111111111111':
        break;
      case '22222222222222':
        break;
      case '33333333333333':
        break;
      case '44444444444444':
        break;
      case '55555555555555':
        break;
      case '66666666666666':
        break;
      case '77777777777777':
        break;
      case '88888888888888':
        break;
      case '99999999999999':
        break;
      default:
        if (val.length === 14) {
          //1st validation number
          let r1: number = (parseInt(val[0]) * 5) + (parseInt(val[1]) * 4) + (parseInt(val[2]) * 3) +
            (parseInt(val[3]) * 2) + (parseInt(val[4]) * 9) + (parseInt(val[5]) * 8) + (parseInt(val[6]) * 7) +
            (parseInt(val[7]) * 6) + (parseInt(val[8]) * 5) + (parseInt(val[9]) * 4) + (parseInt(val[10]) * 3) +
            (parseInt(val[11]) * 2);

          let r2: number = r1 % 11;
          r2 = r2 < 2 ? 0 : 11 - r2;

          if (r2 === parseInt(val[12])) {
            //2nd validation number
            r1 = (parseInt(val[0]) * 6) + (parseInt(val[1]) * 5) + (parseInt(val[2]) * 4) +
              (parseInt(val[3]) * 3) + (parseInt(val[4]) * 2) + (parseInt(val[5]) * 9) + (parseInt(val[6]) * 8) +
              (parseInt(val[7]) * 7) + (parseInt(val[8]) * 6) + (parseInt(val[9]) * 5) + (parseInt(val[10]) * 4) +
              (parseInt(val[11]) * 3) + (r2 * 2);

            r2 = r1 % 11;
            r2 = r2 < 2 ? 0 : 11 - r2;

            if (r2 === parseInt(val[13])) {
              result = true;
            }

          }

        }
        break;
    }

  } catch (error) {
    result = false;
  }

  return result;
}

export function validateName(val: string) {
  return val.length >= 5 && val.match(/ /g) != null && val.toLowerCase().replace(/[ àáâãäçèéêëìíîïòóôõöùúûüa-z]/g, '').length === 0;
}

export function validateTradeName(val: string) {
  return val.length >= 5 && val.toLowerCase().replace(/[^àáâãäçèéêëìíîïòóôõöùúûüa-z]/g, '').length > 0;
}

export function validateNomeFantasia(val: string) {
  return val.length >= 5 && val.toLowerCase().replace(/ |à|á|â|ã|ä|ç|è|é|ê|ë|ì|í|î|ï|ò|ó|ô|õ|ö|ù|ú|û|ü|[a-z]/g, '').length === 0;
}

export function validatePassword(val: string) {
  let tmpVal: string = val.toLowerCase();

  return val.length >= 6
    && val.length <= 15
    && tmpVal.match(/\d/g) !== null
    && tmpVal.match(/([a-z]|[A-Z])/g) !== null;
}

export function validateDDD(val: string) {
  return val.length === 2 && val.replace(/[0-9]/g, '').length === 0 && val !== '00';
}

export function validatePhoneNumber(val: string) {
  let num = val.replace(/\D/g,  '');
  return num.length === 8 || num.length === 9;
}

export function validateUF(val: string) {
  return val.length === 2 && val.replace(/[A-Z]/g, '').length === 0;
}

export function validateCVV(val: string) {
  return (val.length === 3 || val.length === 4) && val.replace(/[\d]/g, '').length === 0;
}

export function validateCreditCardNumber(val: string) {
  return val.replace(/[ \d]/g, '').length === 0 && val.replace(/[ ]/g,'').length === 16;
}
