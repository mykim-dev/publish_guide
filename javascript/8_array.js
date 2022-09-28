'use strict';

// Array

// 1. Deflaration
const arr1 = new Array();
const arr2 = [1, 2];

// 2. Index position
const fruits = ['사과','바나나'];
console.log(fruits);
console.log(fruits.length);
console.log(fruits[0]); // 첫번째 요소
console.log(fruits[1]);
console.log(fruits[fruits.length - 1]); // 마지막 요소

// 3. Looping over an array
// print all fruits
for (let fruit of fruits){
    console.log(fruit);
}

// c. forEach
fruits.forEach(function(value, index, array){
    console.log(value);
    console.log(index);
    console.log(array);
});

fruits.forEach((value) => console.log(value));

// 4. Addtion, deletion, copy
// push: add an item to the end
fruits.push('딸기','복숭아');
console.log(fruits);

// pop: remove an item from the end
fruits.pop();
fruits.pop();
console.log(fruits);

// unshift: add an item to the benigging
fruits.unshift('딸기', '레몬');
console.log(fruits);

// shift: remove an item from the benigging
fruits.shift();
fruits.shift();
console.log(fruits);

// note!! shift, unshift are slower than pop, push
// splice: remove an item by idex position
fruits.push('딸기','복숭아','레몬');
console.log(fruits);

fruits.splice(1, 1);
console.log(fruits);

fruits.splice(1, 1, '풋사과', '수박');
console.log(fruits);

// combine two arrays
const fruits2 = ['배', '코코넛'];
const newFruits = fruits.concat(fruits2);
console.log(newFruits);

// 5. Searching
// find the index
console.log(fruits.indexOf('사과'));
console.log(fruits.indexOf('수박'));

// includes
console.log(fruits.includes('수박'));
console.log(fruits.includes('멜론'));
console.log(fruits.indexOf('멜론'));

// lastIndexOf
fruits.push('사과');
console.log(fruits.indexOf('사과'))
console.log(fruits.lastIndexOf('사과'))