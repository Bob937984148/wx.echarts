// pages/index/index.js
const ctx = wx.createCanvasContext("bgCanvas")
import * as echarts from '../ec-canvas/echarts';


//index.js
//获取应用实例
const app = getApp();

let ChartPer = null;
let ChartPer2 = null;
let ChartPer3 = null;
let time24;

Page({

  /**
   * 页面的初始数据
   */
  data: {
    option: {},
    hb: {
      lazyLoad: true
    },
    br: {
      lazyLoad: true
    },
    mov: {
      lazyLoad: true
    },
    brData: [],
    hbData: [],
    moveData: [],
    xData: [],
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

    this.echartsHb = this.selectComponent("#mychart-line");
    this.echartsBr = this.selectComponent("#mychart2-line");
    this.echartsMov = this.selectComponent("#mychart-mov");
    this.init_hb_echarts();
    this.init_br_echarts();
    this.init_mov_echarts();
  },

  //销毁时清空Chart
  onUnload: function () {
    ChartPer = null;
    ChartPer2 = null;
    ChartPer3 = null;
  },
  onHide: function () {

  },
  onLoad: function () {
    this.mqtt();
    let xData = [];
    let brData = [];
    let hbData = [];
    for (let i = 0; i < 60; i++) {
      xData.push(i);
      hbData.push(null);
      brData.push(null);
    }
    this.setData({
      xData,
      brData,
      hbData
    })
  },
  init_hb_echarts: function () {
    this.echartsHb.init((canvas, width, height) => {
      //初始化图标
      ChartPer = echarts.init(canvas, null, {
        width: width,
        height: height
      });

      this.setHb();
      //返回值为chart实列否则会有影响
      return ChartPer;
    })
  },

  init_br_echarts: function () {
    this.echartsBr.init((canvas, width, height) => {
      //初始化图标
      ChartPer2 = echarts.init(canvas, null, {
        width: width,
        height: height
      });
      //返回值为chart实列否则会有影响
      this.setBr();
      return ChartPer2;
    })
  },

  init_mov_echarts: function () {
    this.echartsMov.init((canvas, width, height) => {
      //初始化图标
      ChartPer3 = echarts.init(canvas, null, {
        width: width,
        height: height
      });

      this.setMov();
      //返回值为chart实列否则会有影响
      return ChartPer3;
    })
  },

  initOption: function (set) {
    let {
      yMax,
      yMin,
      ySplitNumber,
      markAreaMin,
      markAreaMax
    } = set
    let option = {

      tooltip: {
        show: false
      },
      grid: {
        left: '10%',
        right: '10%',
        top: '10%',
        bottom: '10%',
        height: 'auto',
        z: 2,
        containLavel: true,
      },
      xAxis: [{
        type: 'category',
        boundaryGap: false,
        inverse: true, //反向x轴

        axisLine: {
          show: false,
        },
        axisTick: {
          show: false,
        },
        axisLabel: {
          show: false,
        },
        data: this.data.xData
      }],
      yAxis: [{
        type: 'value',
        max: yMax,
        min: yMin,
        splitNumber: ySplitNumber,
        axisLine: {
          show: false,
        },
        axisTick: {
          show: false,
        },
        axisLabel: {
          color: '#cecff1',
          fontSize: 12,
        },

        splitLine: {
          show: true,
          lineStyle: {
            color: '#333756',
            width: '1'
          }
        },
      }],
      series: [{
        name: '数值',
        type: 'line',
        color: '#cecff1',
        lineStyle: {
          width: 1
        },
        showSymbol: true,
        hoverAnimation: false, //圆点
        markArea: {
          silent: true,
          data: [
            [{
              yAxis: markAreaMin
            }, {
              yAxis: markAreaMax
            }]
          ]
        },
        data: this.data.hbData
      }]
    };
    return option
  },

  setHb: function () {
    let option = this.initOption({
      yMax: 150,
      yMin: 0,
      ySplitNumber: 3,
      markAreaMin: 40,
      markAreaMax: 80
    });
    ChartPer.setOption(option);
    return ChartPer;
  },

  setBr: function () {
    let option = this.initOption({
      yMax: 40,
      yMin: 0,
      ySplitNumber: 4,
      markAreaMin: 10,
      markAreaMax: 20
    });
    ChartPer2.setOption(option);
    return ChartPer2;
  },

  setMov: function () {
    let option = {
      tooltip: {
        show: false
      },

      grid: {
        left: '10%',
        top: '20%',
        right: '10%',
        bottom: '10%'
      },
      xAxis: {
        type: 'category',
        boundaryGap: false,
        data: ['8:00', '8:01', '8:02', '8:03', '8:04', '8:05', '8:06', '8:07', '8:08', '8:09', '8:10'],
        position: 'top',
        axisLine: {
          show: false,
        },
        axisTick: {
          show: false,
        },
        axisLabel: {
          color: '#cecff1',
          fontSize: 12,
        },
        splitLine: {
          show: true,
          lineStyle: {
            color: '#333756',
            width: '1'
          }
        },

      },
      yAxis: {
        type: 'value',
        inverse: true,
        axisTick: {
          show: false,
        },
        splitLine: {
          show: true,
          lineStyle: {
            color: '#333756',
            width: '1'
          }
        },
        axisLabel: {
          color: '#cecff1',
          fontSize: 12,

          formatter: function (value) {
            if (value === 0) {
              return '清醒'
            } else if (value === 1) {
              return '浅睡'
            } else if (value === 2) {
              return '中睡'
            } else if (value === 3) {
              return '深睡'
            }
          }
        },


      },
      series: [{
        data: this.data.moveData,
        symbol: "none",
        itemStyle: {
          normal: {
            shadowBlur: 10,
            shadowColor: 'rgba(31, 51, 79, 0.5)',
            shadowOffsetY: 5,
            color: {
              type: 'linear',
              x: 0,
              y: 0,
              x2: 0,
              y2: 1,
              colorStops: [{
                offset: 0, color: 'rgb(31, 51, 79)' // 0% 处的颜色
              }, {
                offset: 1, color: 'rgb(32, 54, 207)' // 100% 处的颜色
              }],
              global: false // 缺省为 false
            }
          }
        },
        smooth: true,
        type: 'line',
        areaStyle: {}
      }]
    };
    ChartPer3.setOption(option);
    return ChartPer3;
  },

  mqtt: function () {
    let that = this;

    that.bhUpdata()


  },
  //实时跟新
  bhUpdata: function (newData) {

    let set = setInterval(() => {
      let {
        brData,
        hbData,
        moveData
      } = this.data;
      hbData.push(parseInt(Math.random() * 60));
      brData.push(parseInt(Math.random() * 40));
      moveData.push(parseInt(Math.random() * 4));
      if (moveData.length >= 12) {
        moveData.shift();
      }
      if (brData.length >= 60) {
        brData.shift();
        hbData.shift();
      }
      ChartPer.setOption({
        series: [{
          data: hbData
        }]
      });
      ChartPer2.setOption({
        series: [{
          data: brData
        }]
      });
      ChartPer3.setOption({
        series: [{
          data: moveData
        }]
      })
      this.setData({
        brData,
        hbData,
        moveData
      })
    }, 3000)
  }
})