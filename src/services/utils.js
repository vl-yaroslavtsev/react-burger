import { useLayoutEffect } from "react";
import appStyles from "../components/app/app.module.css";

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

export function setCookie(name, value, props = {}) {
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

export function formatPastDate(date) {
  const today = new Date();
  today.setHours(0);
  today.setMinutes(0);
  today.setSeconds(0);

  date = new Date(date);
  const timezone = date.getHours() - date.getUTCHours();
  const hours = date.getHours().toString().padStart(2, "0");
  const minutes = date.getMinutes().toString().padStart(2, "0");

  let past = "";

  if (date > today * 1 + 24 * 3600 * 1000) {
    past = date.toLocaleDateString();
  } else if (date > today) {
    past = "Сегодня";
  } else if (date > today - 24 * 3600 * 1000) {
    past = "Вчера";
  } else {
    const days = Math.ceil((today - date) / (24 * 3600 * 1000));
    past = `${days} дня назад`;
  }

  return `${past}, ${hours}:${minutes} i-GMT${
    timezone > 0 ? "+" : ""
  }${timezone}`;
}

export const timingFunc = {
  linear(k) {
    return k;
  },
  easeIn(k) {
    return Math.pow(k, 1.675);
  },
  easeOut: function (k) {
    return 1 - Math.pow(1 - k, 1.675);
  },
  easeInOut(k) {
    return 0.5 * (Math.sin((k - 0.5) * Math.PI) + 1);
  },
};

export function animate({ timing = "easeInOut", draw, duration }) {
  let start = performance.now();
  timing = timingFunc[timing];

  return new Promise((resolve) => {
    requestAnimationFrame(function animate(time) {
      // timeFraction изменяется от 0 до 1
      let timeFraction = (time - start) / duration;
      if (timeFraction > 1) timeFraction = 1;
      if (timeFraction < 0) timeFraction = 0;

      // вычисление текущего состояния анимации
      let progress = timing(timeFraction);

      draw(progress); // отрисовать её

      if (timeFraction < 1) {
        requestAnimationFrame(animate);
      } else {
        resolve();
      }
    });
  });
}

export function useScrollbar(ref, { exclude = [], props = [] } = {}) {
  useLayoutEffect(() => {
    const el = ref.current;

    if (!el) return;

    if (!Array.isArray(exclude)) {
      exclude = [exclude];
    }
    const bottom = exclude.reduce((acc, ref) => {
      const el = ref.current;
      if (!el) return acc;
      const style = getComputedStyle(el);

      return (
        acc +
        el.offsetHeight +
        parseInt(style.marginTop) +
        parseInt(style.marginBottom)
      );
    }, 0);
    const { top } = el.getBoundingClientRect();
    el.style.maxHeight = `calc(100vh - ${top + bottom}px)`;
    el.classList.add(appStyles.customScrollbar);

    return () => {
      el.classList.remove(appStyles.customScrollbar);
      el.style.maxHeight = "";
    };
  }, props);
}
