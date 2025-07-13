/**
 * @file Домашка по FP ч. 1
 *
 * Основная задача — написать самому, или найти в FP библиотеках функции anyPass/allPass
 * Эти функции/их аналоги есть и в ramda и в lodash
 *
 * allPass — принимает массив функций-предикатов, и возвращает функцию-предикат, которая
 * вернет true для заданного списка аргументов, если каждый из предоставленных предикатов
 * удовлетворяет этим аргументам (возвращает true)
 *
 * anyPass — то же самое, только удовлетворять значению может единственная функция-предикат из массива.
 *
 * Если какие либо функции написаны руками (без использования библиотек) это не является ошибкой
 */
import {
  pipe,
  allPass,
  equals,
  prop,
  values,
  count,
  lte,
  converge,
  anyPass,
  not,
  map,
} from "ramda";

import { SHAPES, COLORS } from "../constants";

const CIRCLE = prop(SHAPES.CIRCLE);
const SQUARE = prop(SHAPES.SQUARE);
const STAR = prop(SHAPES.STAR);
const TRIANGLE = prop(SHAPES.TRIANGLE);

const isBLUE = equals(COLORS.BLUE);
const isGREEN = equals(COLORS.GREEN);
const isORANGE = equals(COLORS.ORANGE);
const isRED = equals(COLORS.RED);
const isWHITE = equals(COLORS.WHITE);

// Фигура есть в SHAPES
// const isFigureValid = (figure) => includes(figure, values(SHAPES));

const countColors = (color) => pipe(values, count(color));

// Check Фигура === Цвет
const isShapeColorEquals = (figure, color) => pipe(figure, color);

// 1. Красная звезда, зеленый квадрат, все остальные белые.
export const validateFieldN1 = allPass([
  isShapeColorEquals(STAR, isRED),
  isShapeColorEquals(SQUARE, isGREEN),
  isShapeColorEquals(TRIANGLE, isWHITE),
  isShapeColorEquals(CIRCLE, isWHITE),
]);

// Минимальное количество цветов
const minColorsCount = (color, count) => pipe(countColors(color), lte(count));
// 2. Как минимум две фигуры зеленые.
export const validateFieldN2 = minColorsCount(isGREEN, 2);

// Количество фигур количество фигур выбранных цветов должно быть равно
const isColorCountEquals = (colors) =>
  converge(equals, map(countColors, colors));

// 3. Количество красных фигур равно кол-ву синих.
export const validateFieldN3 = isColorCountEquals([isRED, isBLUE]);

// 4. Синий круг, красная звезда, оранжевый квадрат треугольник любого цвета
export const validateFieldN4 = allPass([
  isShapeColorEquals(STAR, isRED),
  isShapeColorEquals(SQUARE, isORANGE),
  isShapeColorEquals(CIRCLE, isBLUE),
]);

// 5. Три фигуры одного любого цвета кроме белого (четыре фигуры одного цвета – это тоже true).
export const validateFieldN5 = anyPass([
  minColorsCount(isRED, 3),
  minColorsCount(isORANGE, 3),
  minColorsCount(isBLUE, 3),
  minColorsCount(isGREEN, 3),
]);

// Равное количество цветов
const equalsColorsCount = (color, count) =>
  pipe(countColors(color), equals(count));
// 6. Ровно две зеленые фигуры (одна из зелёных – это треугольник), плюс одна красная. Четвёртая оставшаяся любого доступного цвета, но не нарушающая первые два условия
export const validateFieldN6 = allPass([
  equalsColorsCount(isGREEN, 2),
  equalsColorsCount(isRED, 1),
  isShapeColorEquals(TRIANGLE, isGREEN),
]);

// 7. Все фигуры оранжевые.
export const validateFieldN7 = minColorsCount(isORANGE, 4);

// Check Фигура !== Цвет
const isShapeColorNotEquals = (figure, color) =>
  pipe(isShapeColorEquals(figure, color), not);
// 8. Не красная и не белая звезда, остальные – любого цвета.
export const validateFieldN8 = allPass([
  isShapeColorNotEquals(STAR, isRED),
  isShapeColorNotEquals(STAR, isWHITE),
]);

// 9. Все фигуры зеленые.
export const validateFieldN9 = minColorsCount(isGREEN, 4);

// выбранные фигуры должны быть одного цвета
const isShapesSameColorEquals = (shapes) =>
  converge(equals, shapes);

// 10. Треугольник и квадрат одного цвета (не белого), остальные – любого цвета
export const validateFieldN10 = allPass([
  isShapeColorNotEquals(SQUARE, isWHITE),
  isShapeColorNotEquals(TRIANGLE, isWHITE),
  isShapesSameColorEquals([SQUARE, TRIANGLE]),
]);
