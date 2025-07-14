/**
 * @file Домашка по FP ч. 2
 *
 * Подсказки:
 * Метод get у инстанса Api – каррированый
 * GET / https://animals.tech/{id}
 *
 * GET / https://api.tech/numbers/base
 * params:
 * – number [Int] – число
 * – from [Int] – из какой системы счисления
 * – to [Int] – в какую систему счисления
 *
 * Иногда промисы от API будут приходить в состояние rejected, (прямо как и API в реальной жизни)
 * Ответ будет приходить в поле {result}
 */
import {
  prop,
  partialRight,
  assoc,
  tap,
  pipe,
  ifElse,
  andThen,
  allPass,
  length,
  gt,
  lt,
  __,
  test,
  compose,
  partial
} from "ramda";
import Api from "../tools/api";

const api = new Api();

const getInteger = Math.round;
const getResult = prop(["result"]);
const getPow2 = partialRight(Math.pow, [2]);
const getMod3 = (val) => val % 3;

const getNumberBaseRinary = pipe(
  assoc("number", __, { from: 10, to: 2 }),
  api.get("https://api.tech/numbers/base")
);

const fetchAnimal = async (id) =>
  await api.get(`https://animals.tech/${id}`, {});

const isStringGt10 = pipe(length, gt(10));
const isStringLt2 = pipe(length, lt(2));
const isNumbers = test(/^[0-9]+\.?[0-9]+$/);
const isValidValue = allPass([isStringGt10, isStringLt2, isNumbers]);
// const isValidValue = allPass([
//   pipe(length, gt(2)),
//   pipe(length, lt(10)),
//   isNumbers
// ]);
const processSequence = ({ value, writeLog, handleSuccess, handleError }) => {
  const tapLog = tap(writeLog);
  const handlerError = partial(handleError, ["ValidationError"]);
  const __processSequence = compose(
    andThen(
      compose(
        andThen(compose(handleSuccess, getResult)),
        fetchAnimal,
        tapLog,
        getMod3,
        tapLog,
        getPow2,
        tapLog,
        length,
        tapLog,
        getResult
      )
    ),
    getNumberBaseRinary,
    tapLog,
    getInteger
  );

  // перехватываем ошибку Network error чтобы отобразить ее в логе
  const safeRunSequence = (x) => __processSequence(x).catch(handleError);

  pipe(tapLog, ifElse(isValidValue, safeRunSequence, handlerError))(value);
};

export default processSequence;
