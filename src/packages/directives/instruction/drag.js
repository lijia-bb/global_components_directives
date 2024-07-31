export default {
  mounted(el) {
    let moveEl = el.firstElementChild
    const mouseDown = (e) => {
      //鼠标点击物体那一刻相对于物体左侧边框的距离=点击时的位置相对于浏览器最左边的距离-物体左边框相对于浏览器最左边的距离
      console.log(e.clientX, e.clientY, '-----起始', el.offsetLeft)
      let X = e.clientX - el.offsetLeft
      let Y = e.clientY - el.offsetTop
      const move = (e) => {
        el.style.left = e.clientX - X + 'px'
        el.style.top = e.clientY - Y + 'px'
        console.log(e.clientX, e.clientY, '---改变')
      }
      document.addEventListener('mousemove', move)
      document.addEventListener('mouseup', () => {
        document.removeEventListener('mousemove', move)
      })
    }
    moveEl.addEventListener('mousedown', mouseDown)
  }
}
