export function getCookie(name) {
  const matches = document.cookie.match(
    new RegExp(
      "(?:^|; )" +
        name.replace(/([\.$?*|{}\(\)\[\]\\\/\+^])/g, "\\$1") +
        "=([^;]*)"
    )
  );
  return matches ? decodeURIComponent(matches[1]) : undefined;
}

export function setCookie(name, value, props) {
  props = props || {};
  let exp = props.expires;
  if (typeof exp == "number" && exp) {
    const d = new Date();
    d.setTime(d.getTime() + exp * 1000);
    exp = props.expires = d;
  }
  if (exp && exp.toUTCString) {
    props.expires = exp.toUTCString();
  }
  props.path = "/";
  value = encodeURIComponent(value);
  let updatedCookie = name + "=" + value;
  for (const propName in props) {
    updatedCookie += "; " + propName;
    const propValue = props[propName];
    if (propValue !== true) {
      updatedCookie += "=" + propValue;
    }
  }
  document.cookie = updatedCookie;
}

export function deleteCookie(name) {
  setCookie(name, null, { expires: -1 });
}

export function isEqual(obj1, obj2) {
  // Цикл через свойства объекта obj1
  for (const p in obj1) {
    //Проверка на то, что оба объекта существуют
    if (obj1.hasOwnProperty(p) !== obj2.hasOwnProperty(p)) return false;

    switch (typeof obj1[p]) {
      // Глубокое сравнение объектов по ключам и значения:
      case "object":
        if (!Object.compare(obj1[p], obj2[p])) return false;
        break;
      // Сравнение данных типа function:
      case "function":
        if (
          typeof obj2[p] == "undefined" ||
          (p != "compare" && obj1[p].toString() != obj2[p].toString())
        )
          return false;
        break;
      // Сравнение значений:
      default:
        if (obj1[p] != obj2[p]) return false;
    }
  }

  // Проверка объекта obj2 на дополнительные свойства:
  for (const p in obj2) {
    if (typeof obj1[p] == "undefined") return false;
  }
  return true;
}
