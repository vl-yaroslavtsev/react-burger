import { useEffect, useRef, useState } from "react";

export function getCookie(name: string) {
  const matches = document.cookie.match(
    new RegExp(
      "(?:^|; )" + name.replace(/([.$?*|{}()[]\\\/+^])/g, "\\$1") + "=([^;]*)"
    )
  );
  return matches ? decodeURIComponent(matches[1]) : undefined;
}

export function setCookie(
  name: string,
  value: string,
  props: {
    expires?: number | Date | string;
    path?: string;
  } = {}
) {
  let exp = props.expires;
  if (typeof exp == "number" && exp) {
    const d = new Date();
    d.setTime(d.getTime() + exp * 1000);
    exp = props.expires = d;
  }
  if (exp && exp instanceof Date) {
    props.expires = exp.toUTCString();
  }
  props.path = "/";
  value = encodeURIComponent(value);
  let updatedCookie = name + "=" + value;
  for (const propName in props) {
    updatedCookie += "; " + propName;
    const propValue = (props as { [key: string]: string | boolean })[propName];
    if (propValue !== true) {
      updatedCookie += "=" + propValue;
    }
  }
  document.cookie = updatedCookie;
}

export function deleteCookie(name: string) {
  setCookie(name, "", { expires: -1 });
}

export function isEqual(obj1: any, obj2: any) {
  // Цикл через свойства объекта obj1
  for (const p in obj1) {
    //Проверка на то, что оба объекта существуют
    if (obj1.hasOwnProperty(p) !== obj2.hasOwnProperty(p)) return false;

    switch (typeof obj1[p]) {
      // Глубокое сравнение объектов по ключам и значения:
      case "object":
        if (!isEqual(obj1[p], obj2[p])) return false;
        break;
      // Сравнение данных типа function:
      case "function":
        if (
          typeof obj2[p] == "undefined" ||
          (p !== "compare" && obj1[p].toString() !== obj2[p].toString())
        )
          return false;
        break;
      // Сравнение значений:
      default:
        if (obj1[p] !== obj2[p]) return false;
    }
  }

  // Проверка объекта obj2 на дополнительные свойства:
  for (const p in obj2) {
    if (typeof obj1[p] == "undefined") return false;
  }
  return true;
}

/**
 * Склонение существительного с числом
 * @param {*} n число
 * @param {Array} text_forms существительной в формате [один, два, пять]
 * @returns
 */
function declensionOfNum(n: number, text_forms: [string, string, string]) {
  n = Math.abs(n) % 100;
  var n1 = n % 10;
  if (n > 10 && n < 20) {
    return text_forms[2];
  }
  if (n1 > 1 && n1 < 5) {
    return text_forms[1];
  }
  if (n1 === 1) {
    return text_forms[0];
  }
  return text_forms[2];
}

export function formatPastDate(dateStr: string) {
  const today = new Date();
  today.setHours(0);
  today.setMinutes(0);
  today.setSeconds(0);

  const date = new Date(dateStr);
  const timezone = date.getHours() - date.getUTCHours();
  const hours = date.getHours().toString().padStart(2, "0");
  const minutes = date.getMinutes().toString().padStart(2, "0");

  let past = "";

  if (date.getTime() > today.getTime() + 24 * 3600 * 1000) {
    past = date.toLocaleDateString();
  } else if (date > today) {
    past = "Сегодня";
  } else if (date.getTime() > today.getTime() - 24 * 3600 * 1000) {
    past = "Вчера";
  } else {
    const days = Math.ceil(
      (today.getTime() - date.getTime()) / (24 * 3600 * 1000)
    );
    past = `${days} ${declensionOfNum(days, ["день", "дня", "дней"])} назад`;
  }

  return `${past}, ${hours}:${minutes} i-GMT${
    timezone > 0 ? "+" : ""
  }${timezone}`;
}

export const timingFunctions = {
  linear(k: number) {
    return k;
  },
  easeIn(k: number) {
    return Math.pow(k, 1.675);
  },
  easeOut(k: number) {
    return 1 - Math.pow(1 - k, 1.675);
  },
  easeInOut(k: number) {
    return 0.5 * (Math.sin((k - 0.5) * Math.PI) + 1);
  },
};

interface IAnimateProps {
  timing?: keyof typeof timingFunctions;
  draw: (step: number) => void;
  duration: number;
}

export function animate({
  timing = "easeInOut",
  draw,
  duration,
}: IAnimateProps) {
  const start = performance.now();
  const timingFunc = timingFunctions[timing];

  return new Promise((resolve) => {
    requestAnimationFrame(function animate(time) {
      // timeFraction изменяется от 0 до 1
      let timeFraction = (time - start) / duration;
      if (timeFraction > 1) timeFraction = 1;
      if (timeFraction < 0) timeFraction = 0;

      // вычисление текущего состояния анимации
      const progress = timingFunc(timeFraction);

      draw(progress); // отрисовать её

      if (timeFraction < 1) {
        requestAnimationFrame(animate);
      } else {
        resolve(true);
      }
    });
  });
}

// Хук: получаем предыдущее значение пропса или состояния
export function usePrevious(value: any) {
  const ref = useRef();
  useEffect(() => {
    ref.current = value;
  }, [value]);
  return ref.current;
}

export function isTouchDevice() {
  return (
    "ontouchstart" in window ||
    navigator.maxTouchPoints > 0 ||
    navigator.msMaxTouchPoints > 0
  );
}

/**
 * Хук назначает выполнение callback на событие изменения ширины экрана с определенной оптимизацией
 * @param callback Функция для выполнения при изменении ширины экрана
 * @param props Пропсы, при изменении которых происходит сброс
 */
export function useWindowResize(callback: Function, props?: any[]) {
  let running = false;

  function run() {
    callback();
    running = false;
  }

  function onResize() {
    if (!running) {
      running = true;

      if (window.requestAnimationFrame) {
        window.requestAnimationFrame(run);
      } else {
        setTimeout(run, 66);
      }
    }
  }

  useEffect(() => {
    window.addEventListener("resize", onResize);

    return function cleanup() {
      window.removeEventListener("resize", onResize);
    };
  }, props);
}

export const getScreenSize = () => {
  const width = window.innerWidth;
  if (width < 768) {
    return "mobile";
  } else if (width < 1024) {
    return "tablet";
  }
  return "desktop";
};

export function useScreenSize() {
  const [screenSize, setScreenSize] = useState(getScreenSize());

  useWindowResize(() => {
    setScreenSize(getScreenSize());
  }, []);

  return screenSize;
}
