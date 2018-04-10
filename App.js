/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */

import React, { Component } from 'react';
import {
  Dimensions,
  StyleSheet,
  Text,
  View,
  ScrollView,
  Image
} from 'react-native';

let imagesData = require('./ImageData');
let {width} = Dimensions.get('window');
type Props = {};
export default class App extends Component<Props> {
  //本类定义属性的写法 要加上static
  static defaultProps = {
    duration: 3000,
  }

  //构造法
  constructor(props) {
    super(props);
    this.state = {
      currentPage: 0,
    };
  }

  //构造图片空间
  renderChildView() {
    let allChild = [];
    // let colors = ['red', 'green', 'blue', 'yellow', 'purple', 'black', 'orange'];
    let imagesArr = imagesData.data;
    for (let i = 0; i < imagesArr.length; i++) {
      let imgItem = imagesArr[i];
      allChild.push(
        <Image key={i}
               source={{uri: imgItem.img}}
               style={{width: width, height:120}}
        />
      );
    }
    return allChild;
  }

  //构造滚动状态
  renderPageCircle() {
    let indicatorArr = [];
    let imagesArr = imagesData.data;
    let style;
    for (let i = 0; i < imagesArr.length; i++) {
      let imgItem = imagesArr[i];
      style = (i===this.state.currentPage) ? {borderColor:'red'} : {borderColor:'white'};
      indicatorArr.push(
        <View key={i} style={[styles.circleStyle, style]} />
      );
    }
    return indicatorArr;
  }

  //构造滚动栏标题
  renderPageTitle() {
    let titleArr = [];
    let imagesArr = imagesData.data;
    for (let i = 0; i < imagesArr.length; i++) {
      let imgItem = imagesArr[i];
      if (i === this.state.currentPage) {
        titleArr.push(
          <Text key={i} style={styles.title}>{imgItem.title}</Text>
        );
      }
    }
    return titleArr;
  }


  // 1.(e)=>this.onAnimationEnd(e)等价于this.onAnimationEnd
  // 2.只调用方法不传递元素本身可以直接使用this.onAnimationEnd()
  // 3.this.onAnimationEnd如果需要传递this需要使用this.onAnimationEnd.bind(this)
  render() {
    return (
      <View style={styles.container}>
        <ScrollView
          ref='scrollView'
          contentContainerStyle={styles.contentContainer}
          horizontal={true}
          showsHorizontalScrollIndicator={false}
          pagingEnabled={true}
          bounces={false}
          onMomentumScrollEnd={(e)=>this.onAnimationEnd(e)}
          onScrollBeginDrag={(e)=>this.onScrollBeginDrag(e)}
          onScrollEndDrag={(e)=>this.onScrollEndDrag(e)}
        >
          {this.renderChildView()}
        </ScrollView>
        {/*返回指示器*/}
        <View style={styles.pageViewStyle}>
          {/*返回五个圆点*/}
          {this.renderPageCircle()}
          {this.renderPageTitle()}
        </View>
      </View>
    );
  }

  // 页面组件加载完毕
  componentDidMount () {
    this.startTimer()
  }

  //开启定时器
  startTimer() {
    //获取当前的scrollView
    let scrollView = this.refs.scrollView;

    this.timer = setInterval(
      () => {
        // 更新状态机
        this.setState({
          currentPage: (this.state.currentPage + 1) % imagesData.data.length,
        });
        //滚动scrollView
        let offsetX = this.state.currentPage * width;
        scrollView.scrollTo({x: offsetX, y: 0});

      },
      this.props.duration
    );
  }

  //停止定时器
  stopTimer() {
    // 如果存在this.timer，则使用clearInterval清空。
    // 如果你使用多个timer，那么用多个变量，或者用个数组来保存引用，然后逐个clear
    this.timer && clearInterval(this.timer);
  }

  //拖拽图片结束
  onAnimationEnd(e) {
    //1.求数水平方向的偏移量
    let offSetX = e.nativeEvent.contentOffset.x;
    //2.求出当前的页数
    let page = Math.floor(offSetX / width);
    // 滚动指示
    this.setState({
      currentPage: page,
    });
  }

  //开始拖拽
  onScrollBeginDrag() {
    this.stopTimer();
  }

  //结束拖拽
  onScrollEndDrag() {
    //开启定时器
    this.startTimer();
  }

  componentWillUnmount() {
    // 请注意Un"m"ount的m是小写
    this.stopTimer();
  }
}

const styles = StyleSheet.create({
  container: {
    marginTop: 20
  },
  contentContainer: {
    // paddingVertical: 20
  },
  pageViewStyle: {
    width: width,
    height: 25,
    backgroundColor: 'rgba(0, 0, 0, 0.4)',

    position: 'absolute',
    bottom: 0,

    flexDirection: 'row',
    alignItems: 'center',

  },
  circleStyle: {
    width: 10,
    height: 10,
    borderRadius: 5,
    borderWidth: 5,
    marginLeft: 10,
  },
  title: {
    color: 'white',
    alignItems: 'center',
    position: 'absolute',
    right: 10
  }
});
