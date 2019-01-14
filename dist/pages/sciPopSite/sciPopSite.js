"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = Page({
  data: {
    markers: [],
    pois: [],
    // description image src
    descriptionImageSrc: "../../static/images/cuteColor/zhan-50.png",
    currLocation: {
      latitude: "30.5195640000",
      longitude: "114.4020540000"
      // latitude: "39.9560697701",
      // longitude: "116.2998962402"
    },
    // 选项卡style
    itemStyle: {
      'height': '50rpx',
      'color': '#333',
      'border-color': '#333',
      'background': 'transparent',
      'line-height': '50rpx',
      'font-size': '24rpx',
      'width': '250rpx'
    },
    activeItemStyle: {
      'opacity': '1',
      'color': '#fff',
      'background-color': '#333'
    }
  },
  // 选项卡切换事件函数
  sgmChange: function sgmChange(e) {
    var index = e.detail.index;

    var markersArray = [this.data.markers0, this.data.markers1, this.data.markers2];
    var poisArray = [this.data.pois0, this.data.pois1, this.data.pois2];
    var descriptionImageSrcArray = ["../../static/images/cuteColor/zhan-50.png", "../../static/images/cuteColor/te-50.png", "../../static/images/cuteColor/she-50.png"];
    this.setData({
      markers: markersArray[index],
      pois: poisArray[index],
      descriptionImageSrc: descriptionImageSrcArray[index]
    });
  },

  // 地图markers点击函数
  switchToSiteDetails: function switchToSiteDetails(e) {
    var id_tapped = "";
    if (e.hasOwnProperty("markerId")) {
      id_tapped = e.markerId;
      console.log("---您点击了地图标记：" + id_tapped);
    } else {
      id_tapped = e.currentTarget.id;
      console.log("---您点击了列表：" + id_tapped);
    }

    // poi.id 与 markers.id 同
    // let poisArray = [this.data.pois0, this.data.pois1, this.data.pois2];
    var pois = this.data.pois;
    var res = pois.filter(function (value, index, array) {
      return value.id == id_tapped;
    });
    var poi = res[0];
    console.log(JSON.stringify(poi));
    wx.navigateTo({
      url: "/pages/siteDetails/siteDetails?poi=" + JSON.stringify(poi)
    });
  },


  onLoad: function onLoad() {
    var _this = this;

    // 引入SDK核心类
    var QQMapWX = require("../../static/data/qqmap-wx-jssdk.js");
    // 实例化API核心类
    var qqmapsdk = new QQMapWX({
      key: "5F4BZ-LUMLI-VKBGL-5EK4N-4FVDE-75BC4" // 必填
    });

    //get current location
    wx.getLocation({
      type: "gcj02", //返回可用于wx.openLocation的经纬度
      success: function success(res_getLocation) {
        var currLocation = res_getLocation;
        _this.setData({
          currLocation: currLocation
        });
      },
      fail: function fail(e) {
        console.log("---获取当前位置失败: " + e);
      },
      complete: function complete() {
        var poiTypes = ["大学", "博物馆", "会展中心"];

        poiTypes.forEach(function (poiType, index) {
          getPois(poiType, index);
        });
      }
    });

    function getPois(poiType, index) {
      // var result = [];
      qqmapsdk.reverseGeocoder({
        location: _this.data.currLocation,
        get_poi: 1, //是否返回周边POI列表：1.返回；0不返回(默认),非必须参数
        poi_options: "category=" + poiType + ";page_size=20;page_index=1;radius=5000",

        success: function success(res_reverseGeocoder) {
          var pois = res_reverseGeocoder.result.pois;
          // result.push(pois);
          console.log("---获取poi成功：" + pois);

          var mks = [];
          // 当get_poi为1时，检索当前位置或者location周边poi数据并在地图显示，可根据需求是否使用
          for (var i = 0; i < pois.length; i++) {
            mks.push({
              title: pois[i].title,
              id: pois[i].id,
              latitude: pois[i].location.lat,
              longitude: pois[i].location.lng,
              iconPath: "../../static/images/location-doodle-48-blue.png",
              width: 30,
              height: 30
            });
          }
          // result.push(mks);
          switch (index) {
            case 0:
              _this.setData({
                markers0: mks,
                pois0: pois,
                // 设置默认的markers pois
                markers: mks,
                pois: pois
              });
              break;
            case 1:
              _this.setData({
                markers1: mks,
                pois1: pois
              });
              break;
            case 2:
              _this.setData({
                markers2: mks,
                pois2: pois
              });
              break;
            default:
              break;
          }
        },
        fail: function fail(error) {
          console.error("---获取poi失败：" + error);
        }
      });
    }
  }
});