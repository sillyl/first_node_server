// setTimeout(()=>{
//   console.log('timer')
// })
// setImmediate(()=>{
//   console.log('immediate')
// })

/* 1.结果：
先后随机打印

造成这种情况发生的原因是：timer 的时间检查距当前事件循环 tick 的间隔可能小于 1ms 也可能大于 1ms 的阈值，所以决定了 setTimeout 在第一次事件循环执行与否。

在node 中 即使 setTimeout第二个参数是 0， 在nodejs 中，会被处理成setTimeout(fn, 1). 当主进程的同步代码执行之后，会进入到事件循环阶段
第一次进入timer中，此时setTimeout对应的timer的时间阈值为1，若在前文中uv_run_timer(loop)中，系统时间调用和时间比较的过程总耗时间：
若未超过 1ms， 在timer 阶段会发现没有过期的定时器，那么当前timer就不会执行，接下来进入check 阶段，就会执行setImmediate 回调此时顺序是：setImmediate->setTimeout
若总耗时超过1ms, 执行顺序就会发生变化，在timer阶段，取出过期的setTimeout的任务执行，然后到check 阶段，在执行setImmediate,此时setTimeout-> setImmediate

*/


// 2、
// setTimeout(() => {
//   console.log('timeout1')
//   Promise.resolve().then(()=>{
//         console.log('reslove1')
//     })
// }, 0)

// setTimeout(() => {
//   console.log('timeout2')
//   Promise.resolve().then(()=>{
//         console.log('reslove2')
//     })
// }, 0)

// setImmediate(()=>{
//     console.log('setImmediate1')
// })

// setImmediate(()=>{
//     console.log('setImmediate2')
// })


/* 
2、结果：
  setTimeout(() => {
    console.log('timeout1')
    Promise.resolve().then(()=>{
          console.log('reslove1')
      })
  }, 0)

  setTimeout(() => {
    console.log('timeout2')
    Promise.resolve().then(()=>{
          console.log('reslove2')
      })
  }, 0)

  setImmediate(()=>{
      console.log('setImmediate1')
  })

  setImmediate(()=>{
      console.log('setImmediate2')
  })

  Promise.resolve('resolve3').then((data)=>{
      console.log(data)
  })
*/

// 3、
// setTimeout(() => {
//   console.log('timeout1')
//   Promise.resolve().then(()=>{
//         console.log('reslove1')
//     })
// }, 0)

// setTimeout(() => {
//   console.log('timeout2')
//   Promise.resolve().then(()=>{
//         console.log('reslove2')
//     })
// }, 0)

// setImmediate(()=>{
//     console.log('setImmediate1')
// })

// setImmediate(()=>{
//     console.log('setImmediate2')
// })

// Promise.resolve('resolve3').then((data)=>{
//     console.log(data)
// })

/* 3、结果：
resolve3
timeout1
reslove1
timeout2
reslove2
setImmediate1
setImmediate2
*/


// 链接： https://juejin.cn/post/6844903938852913165



// 4.
process.nextTick(function(){ 
  console.log('1'); 
}); 
process.nextTick(function(){ 
  console.log('2'); 
   setImmediate(function(){ 
      console.log('3'); 
  }); 
  process.nextTick(function(){ 
      console.log('4'); 
  }); 
}); 

setImmediate(function(){ 
  console.log('5'); 
   process.nextTick(function(){ 
      console.log('6'); 
  }); 
  setImmediate(function(){ 
      console.log('7'); 
  }); 
}); 

setTimeout(e=>{ 
  console.log(8); 
  new Promise((resolve,reject)=>{ 
      console.log(8+'promise'); 
      resolve(); 
  }).then(e=>{ 
      console.log(8+'promise+then'); 
  }) 
},0) 

setTimeout(e=>{ console.log(9); },0) 

setImmediate(function(){ 
  console.log('10'); 
  process.nextTick(function(){ 
      console.log('11'); 
  }); 
  process.nextTick(function(){ 
      console.log('12'); 
  }); 
  setImmediate(function(){ 
      console.log('13'); 
  }); 
}); 

console.log('14'); 
new Promise((resolve,reject)=>{ 
  console.log(15); 
  resolve(); 
}).then(e=>{ 
  console.log(16); 
}) 


/* 
14
15
1
2
4
16
8
8promise
8promise+then
9
5
6
10
11
12
3
7
13
*/