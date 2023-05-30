export function getRandomItems(arr, scale) {
  const n = Math.floor(arr.length * (scale / 10)); // 计算需要选择的项目数量
  console.log(n);
  const shuffled = arr.sort(() => 0.5 - Math.random()); // 随机排序数组
  return shuffled.slice(0, n); // 返回前N个项目
}