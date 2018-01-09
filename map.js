window.onload = function(){
  let svg = d3.select('svg')
  let width = svg.attr('width')
  let height = svg.attr('height')
  console.log(d3)
  console.log(dataobj)

  // 创建一个映射
  let projection = d3.geoMercator().fitExtent([[20, 20], [width, height]], china)
  // let projection = d3.geoMercator().center([107, 31]).scale(800).translate([width / 2, (height / 2) + 90])
  // 创建一个带默认设置的地理路径生成器
  let path = d3.geoPath().projection(projection)
  svg.append('g')
    .selectAll('path')
    .data(china.features)
    .enter()
    .append('path')
    .attr('class', 'land')
    .attr('d', path)
  // 以北京经纬度为投影参数，得到北京的像素坐标
  let peking = [116.3, 39.9]
  let proPeking = projection(peking)
  // 用像素坐标绘制一个圆
  svg.append('circle')
  .attr('class', 'point')
  .attr('cx', proPeking[0])
  .attr('cy', proPeking[1])
  .attr('r', 3)
  .attr('fill', 'red')
  // 在地图上显示各个省份的名称
  svg.selectAll('text')
  .data(china.features)
  .enter()
  .append('text')
  // 设置各个省份显示的文字
  .attr('transform', function (d, i) {
    if (d.properties.id === '13') {
      console.log()
      console.log(path.centroid(d))

      return 'translate(' + (path.centroid(d)[0] - 20) + ',' + (path.centroid(d)[1] + 20) + ')'
    }
    return 'translate(' + (path.centroid(d)[0] - 10) + ',' + path.centroid(d)[1] + ')'
  })
  // 显示省名
  .text(function (d) {
    let arr = dataobj.features
    for (let val of arr) {
      if (val.name === d.properties.name) {
        return d.properties.name + val.value
      }
    }
  })
  .attr('font-size', 12)
  .attr('fill', 'red')
  // 将数据保存在数组中，数组索引为各省的名称
  let datas = []
  let datam = []
  for (let val of dataobj.features) {
    let name = val.name
    let value = val.value
    datas[name] = value  //  例如datas[北京]=14149
    datam.push(value)  //  datam数组用于求中间值
  }
  // 取出数据的最大值和最小值
  let maxdata = d3.max(dataobj.features, function (d) {
    return d.value
  })
  let mindata = 0
  // 定义一个线性比例尺
  let linear = d3.scaleLinear().domain([mindata, maxdata]).range([0, 1])
  // 定义颜色
  let b = d3.rgb(13, 62, 70)
  let a = d3.rgb(13, 28, 147)
  // 设置颜色插值
  let color = d3.interpolate(a, b)
  // 给各个省份填充颜色
  let province = d3.selectAll('path')
  province.attr('stroke', '#81eaf0')
  province.attr('fill', function (d, i) {
    let t = linear(datas[d.properties.name])
    let col = color(t)
    return col.toString()
  })
  .on('mouseover', function (d, i) {
    d3.select(this).style('fill', '#21454a')
  })
  .on('mouseout', function (d, i) {
    d3.select(this).style('fill', function (d, i) {
      let t = linear(datas[d.properties.name])
      let col = color(t)
      return col.toString()
    })
  })
  // 显示渐变矩形条
  let defs = svg.append('defs')
  let linearGradient = defs.append('linearGradient')
  .attr('id', 'linearColor')
  // 颜色渐变方向
  .attr('x1', '0%')
  .attr('y1', '0%')
  .attr('x2', '100%')
  .attr('y2', '0%')

  // 设置矩形开始颜色
  let stop1 = linearGradient.append('stop')
  .attr('offset', '0%')
  .attr('stop-color', a.toString())

  // 设置矩形条结束颜色
  let stop2 = linearGradient.append('stop')
  .attr('offset', '100%')
  .attr('stop-color', b.toString())
  let colorRect = svg.append('rect')
  // 矩形左上角坐标
  .attr('x', 50)
  .attr('y', 50)
  // 矩形宽高
  .attr('width', '200')
  .attr('height', '20')
  // 引用上面id设置颜色
  .style('fill', 'url(#' + linearGradient.attr('id') + ')')
  // 设置文字

  // 数据初值
  let startText = svg.append('text')
  .attr('class', 'rect-text')
  .attr('x', 50)
  .attr('y', 45)
  .style('fill', '#6ae3eb')
  .style('font-size', '12px')
  .text(mindata)

  // 数据中间值
  let middleText = svg.append('text')
  .attr('class', 'rect-text')
  .attr('x', 125)
  .attr('y', 45)
  .style('fill', '#6ae3eb')
  .style('font-size', '12px')
  .text(function () {
    return d3.median(datam)
  })

  // 数据末值
  let endText = svg.append('text')
  .attr('x', 250)
  .attr('y', 45)
  .style('fill', '#6ae3eb')
  .style('font-size', '12px')
  .text(maxdata)
}
