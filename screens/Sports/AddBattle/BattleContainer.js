import React from "react";
import moment from "moment";
import styled from "styled-components";
import BattlePresenter from "./BattlePresenter";

var nowDate = moment().format("YYYY-MM-DD");

export default class extends React.Component {
  // Title setting
  static navigationOptions = () => {
    return {
      title: "스포츠 배틀"
    };
  };

  // init 초기상태 값 설정
  state = {
    loading: true,
    sport: null,
    area: null,
    type: null,
    date: nowDate,
    level: null,
    memo: null,
    error: null
  };

  // picker 값 받아옴
  setSportChange = selected => {
    console.log("setSportChange fun ::: " + selected);
    this.setState({
      sport: selected
    });
    // this.state.sport = selected;
    // console.log("get state.sport ::: " + this.state.sport);
  };
  setAreaChange = selected => {
    console.log("setAreaChange fun ::: " + selected);
    this.setState({
      area: selected
    });
  };
  setTypeChange = selected => {
    console.log("setTypeChange fun ::: " + selected);
    this.setState({
      type: selected
    });
  };
  setDateChange = selected => {
    this.state.date = selected;
    this.setState({
      date: selected
    });
    console.log("setDateChange fun ::: " + this.state.date);
    // this.onDateChanging();
  };
  setLevelChange = selected => {
    console.log("setLevelChange fun ::: " + selected);
    this.setState({
      level: selected
    });
  };
  setMemoChange = selected => {
    console.log("setMemoChange fun ::: " + selected);
    this.setState({
      memo: selected
    });
  };

  // init 초기값
  async componentDidMount() {
    // let : 변할 수 있는 변수
    let insertBattle, error;
    try {
      // 배틀 리스트 불러오기
      //   ({
      //     data: { results: insertBattle }
      //   } = await tv.getPopular());
    } catch (error) {
      console.log("insert Battle api error ::: " + error);
      error = "Cant't insert Battle.";
    } finally {
      this.setState({
        loading: false,
        error,
        insertBattle
      });
    }
  }

  // date change
  onDateChanging = async () => {
    const { date } = this.state.date;
    // if (date !== "") {
    console.log("date Changing ::: " + date);

    return;
    // }
  };

  // 배틀 추가하는 api 따로 생성
  updateBattle = async () => {
    let error;
    try {
    } catch (error) {
      console.log("update Battle error ::: " + error);
    } finally {
      this.setState({
        error
      });
      console.log(
        this.state.sport,
        this.state.area,
        this.state.type,
        this.state.date,
        this.state.level,
        this.state.memo
      );
    }
    return;
  };

  render() {
    const { loading, insertBattle, date } = this.state;
    return (
      <BattlePresenter
        loading={loading}
        insertBattle={insertBattle}
        date={date}
        setSportChange={this.setSportChange}
        setAreaChange={this.setAreaChange}
        setTypeChange={this.setTypeChange}
        setDateChange={this.setDateChange}
        setLevelChange={this.setLevelChange}
        setMemoChange={this.setMemoChange}
        updateBattle={this.updateBattle}
      />
    );
  }
}
