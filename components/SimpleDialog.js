import React, {Component} from 'react';
import {
  StyleSheet,
  View,
  Text,
  Image,
  TouchableHighlight,
  TouchableOpacity,
  Modal,
  Dimensions,
  TextInput,
  Keyboard,
} from 'react-native';
import Layout from '../constants/Layout';
import {
  GREY_COLOR2,
  BG_COLOR,
  TINT_COLOR,
  GREY_COLOR3,
} from '../constants/Colors';
import Toast from 'react-native-easy-toast';

export default class SimpleDialog extends Component {
  constructor(props) {
    super(props);
    this.state = {
      width: Layout.width,
      height: Layout.height,
      handleEmail: '',
      changePassword: '',
      changePasswordCheck: '',
      battleResult: '',
      rating: 5,
      randomNum: '',
    };
    Dimensions.addEventListener('change', e => {
      this.setState(e.window);
    });
  }

  handleEmail = getEmail => {
    this.setState({
      handleEmail: getEmail,
    });
  };
  changePassword = getPassword => {
    this.setState({
      changePassword: getPassword,
    });
  };
  changePasswordCheck = getPassword => {
    this.setState({
      changePasswordCheck: getPassword,
    });
  };
  toastView = msg => {
    Keyboard.dismiss();
    this.refs.toast.show(msg);
  };

  closeModal = data => {
    if (data === 'random') {
      this.props.changeModalVisiblity(false);
      this.createRandomNumber();
    } else if (data === 'start') {
      this.props.setData(data, this.state.rating, this.state.battleResult);
    } else if (data === 'CHANGE') {
      this.props.changeModalVisiblity(false);
      this.props.setData(data, this.state.changePassword);
    } else if (data === 'FIND') {
      this.props.changeModalVisiblity(false);
      this.props.setData(data, this.state.handleEmail);
    } else {
      this.props.changeModalVisiblity(false);
      this.props.setData(data, this.state.rating);
    }
  };

  createRandomNumber = () => {
    // [ 20 / 20 / 20 / 15 / 15 / 10 ]
    let RandomNumber = Math.floor(Math.random() * 100) + 1;
    // let RandomNumber = 35;
    console.log('random number: ' + RandomNumber);
    if (RandomNumber < 31) {
      this.setState({randomNum: 'fail'});
      this.props.setData('fail', this.state.rating);
    } else if (30 < RandomNumber && RandomNumber < 46) {
      this.setState({randomNum: 'success'});
      this.props.setData('success', this.state.rating);
    } else if (45 < RandomNumber && RandomNumber < 61) {
      this.setState({randomNum: 'success2'});
      this.props.setData('success2', this.state.rating);
    } else if (60 < RandomNumber && RandomNumber < 76) {
      this.setState({randomNum: 'success3'});
      this.props.setData('success3', this.state.rating);
    } else if (75 < RandomNumber && RandomNumber < 86) {
      this.setState({randomNum: 'success4'});
      this.props.setData('success4', this.state.rating);
    } else if (85 < RandomNumber && RandomNumber < 93) {
      this.setState({randomNum: 'success5'});
      this.props.setData('success5', this.state.rating);
    } else if (92 < RandomNumber && RandomNumber < 98) {
      this.setState({randomNum: 'success6'});
      this.props.setData('success6', this.state.rating);
    } else {
      this.setState({randomNum: 'success7'});
      this.props.setData('success7', this.state.rating);
    }
  };

  render() {
    return this.props.battleState === '로그아웃' ? (
      <TouchableOpacity
        activeOpacity={1}
        disabled={true}
        style={styles.contentContainer}>
        <View style={[styles.modal, {width: this.state.width - 80}]}>
          <View style={styles.textView}>
            <Text style={[styles.text, {color: 'black'}, {fontSize: 20}]}>
              로그아웃 하시겠습니까?
            </Text>
            {/* <Text style={styles.text}> Modal Text </Text> */}
          </View>
          <View style={styles.buttonView}>
            <TouchableHighlight
              onPress={() => this.closeModal('Cancel')}
              style={styles.touchableHighlight}
              underlayColor={'#f1f1f1'}>
              <Text style={[styles.text, {color: 'red'}]}> 취소 </Text>
            </TouchableHighlight>
            <TouchableHighlight
              onPress={() => this.closeModal('OK')}
              style={styles.touchableHighlight}
              underlayColor={'#f1f1f1'}>
              <Text style={[styles.text, {color: 'orange'}]}> 로그아웃 </Text>
            </TouchableHighlight>
          </View>
        </View>
      </TouchableOpacity>
    ) : this.props.battleState === '비밀번호찾기' ? (
      <TouchableOpacity
        activeOpacity={1}
        disabled={true}
        style={styles.contentContainer}>
        <View style={[styles.loseModal, {width: this.state.width - 80}]}>
          <View style={styles.textView}>
            <Text style={[styles.text, {color: 'black'}, {fontSize: 20}]}>
              가입시 등록한{'\n'}이메일(아이디)을 입력해 주세요.
            </Text>
          </View>
          <Text style={styles.textPS}> ● 이메일 </Text>
          <TextInput
            style={styles.textInput}
            onChangeText={this.handleEmail}
            returnKeyType={'done'}
            keyboardType={'email-address'}
            placeholder={'이메일을 입력해주세요.'}
            placeholderTextColor={GREY_COLOR2}
            value={this.state.handleEmail}
          />
          <View style={styles.buttonView}>
            <TouchableHighlight
              onPress={() => this.closeModal('Cancel')}
              style={styles.touchableHighlight}
              underlayColor={'#f1f1f1'}>
              <Text style={[styles.text, {color: 'red'}]}> 취소 </Text>
            </TouchableHighlight>
            <TouchableHighlight
              onPress={() => {
                this.state.handleEmail === ''
                  ? this.toastView('등록한 이메일(아이디)을 입력해주세요.')
                  : this.closeModal('FIND');
              }}
              style={styles.touchableHighlight}
              underlayColor={'#f1f1f1'}>
              <Text style={[styles.text, {color: 'orange'}]}> 찾기 </Text>
            </TouchableHighlight>
          </View>
        </View>
        <Toast
          ref="toast"
          style={{backgroundColor: BG_COLOR}}
          position="bottom"
          positionValue={100}
          fadeInDuration={750}
          fadeOutDuration={1500}
          opacity={1}
          textStyle={{color: TINT_COLOR}}
        />
      </TouchableOpacity>
    ) : this.props.battleState === '비밀번호변경' ? (
      <TouchableOpacity
        activeOpacity={1}
        disabled={true}
        style={styles.contentContainer}>
        <View style={[styles.passwordModal, {width: this.state.width - 80}]}>
          <View style={styles.textView}>
            <Text style={[styles.text, {color: 'black'}, {fontSize: 20}]}>
              변경할 비밀번호를 입력해 주세요.
            </Text>
          </View>
          <Text style={styles.textPS}> ● 비밀번호 </Text>
          <TextInput
            style={styles.textInput}
            onChangeText={this.changePassword}
            returnKeyType={'done'}
            keyboardType={'default'}
            placeholder={'비밀번호를 입력해주세요.'}
            placeholderTextColor={GREY_COLOR2}
            value={this.state.changePassword}
            secureTextEntry
          />
          <Text style={styles.textPS}> ● 비밀번호 확인 </Text>
          <TextInput
            style={styles.textInput}
            onChangeText={this.changePasswordCheck}
            returnKeyType={'done'}
            keyboardType={'default'}
            placeholder={'비밀번호 확인.'}
            placeholderTextColor={GREY_COLOR2}
            value={this.state.changePasswordCheck}
            secureTextEntry
          />
          <View style={styles.buttonView}>
            <TouchableHighlight
              onPress={() => this.closeModal('Cancel')}
              style={styles.touchableHighlight}
              underlayColor={'#f1f1f1'}>
              <Text style={[styles.text, {color: 'red'}]}> 취소 </Text>
            </TouchableHighlight>
            <TouchableHighlight
              onPress={() => {
                this.state.changePassword === '' ||
                this.state.changePasswordCheck === ''
                  ? this.toastView('변경할 비밀번호를 입력해주세요.')
                  : this.state.changePassword !== this.state.changePasswordCheck
                  ? this.toastView('변경할 비밀번호가 일치하지 않습니다.')
                  : this.closeModal('CHANGE');
              }}
              style={styles.touchableHighlight}
              underlayColor={'#f1f1f1'}>
              <Text style={[styles.text, {color: 'orange'}]}> 변경 </Text>
            </TouchableHighlight>
          </View>
        </View>
        <Toast
          ref="toast"
          style={{backgroundColor: BG_COLOR}}
          position="bottom"
          positionValue={100}
          fadeInDuration={750}
          fadeOutDuration={1500}
          opacity={1}
          textStyle={{color: TINT_COLOR}}
        />
      </TouchableOpacity>
    ) : this.props.battleState === '회원탈퇴' ? (
      <TouchableOpacity
        activeOpacity={1}
        disabled={true}
        style={styles.contentContainer}>
        <View style={[styles.modal, {width: this.state.width - 80}]}>
          <View style={styles.textView}>
            <Text style={[styles.text, {color: 'black'}, {fontSize: 20}]}>
              회원탈퇴 하시겠습니까?
            </Text>
            {/* <Text style={styles.text}> Modal Text </Text> */}
          </View>
          <View style={styles.buttonView}>
            <TouchableHighlight
              onPress={() => this.closeModal('Cancel')}
              style={styles.touchableHighlight}
              underlayColor={'#f1f1f1'}>
              <Text style={[styles.text, {color: 'red'}]}> 취소 </Text>
            </TouchableHighlight>
            <TouchableHighlight
              onPress={() => this.closeModal('OK')}
              style={styles.touchableHighlight}
              underlayColor={'#f1f1f1'}>
              <Text style={[styles.text, {color: 'orange'}]}> 탈퇴 </Text>
            </TouchableHighlight>
          </View>
        </View>
      </TouchableOpacity>
    ) : this.props.battleStart === '배틀시작' &&
      this.props.battleState === '배틀신청중' ? (
      <TouchableOpacity
        activeOpacity={1}
        disabled={true}
        style={styles.contentContainer}>
        <View style={[styles.battleStartModal, {width: this.state.width - 80}]}>
          <View style={styles.textView}>
            <Text style={[styles.text, {color: 'black'}, {fontSize: 20}]}>
              배틀신청
            </Text>
            <Text style={styles.text}>
              배틀을 신청 하시겠습니까?
              {'\n'}
              상대방이 신청수락시 배틀코인 1개가 차감 됩니다.
            </Text>
          </View>
          <View style={styles.buttonView}>
            <TouchableHighlight
              onPress={() => this.closeModal('Cancel')}
              style={styles.touchableHighlight}
              underlayColor={'#f1f1f1'}>
              <Text style={[styles.text, {color: 'red'}]}> 아니요 </Text>
            </TouchableHighlight>
            <TouchableHighlight
              onPress={() => this.closeModal('battleStart')}
              style={styles.touchableHighlight}
              underlayColor={'#f1f1f1'}>
              <Text style={[styles.text, {color: 'orange'}]}> 예 </Text>
            </TouchableHighlight>
          </View>
        </View>
      </TouchableOpacity>
    ) : this.props.battleState === '배틀신청중' ? (
      <TouchableOpacity
        activeOpacity={1}
        disabled={true}
        style={styles.contentContainer}>
        <View style={[styles.battleModal, {width: this.state.width - 80}]}>
          <View style={styles.textView}>
            <Text style={[styles.text, {color: 'black'}, {fontSize: 20}]}>
              배틀신청 취소
            </Text>
            <Text style={styles.text}> 배틀신청을 취소 하시겠습니까? </Text>
          </View>
          <View style={styles.buttonView}>
            <TouchableHighlight
              onPress={() => this.closeModal('Cancel')}
              style={styles.touchableHighlight}
              underlayColor={'#f1f1f1'}>
              <Text style={[styles.text, {color: 'red'}]}> 아니요 </Text>
            </TouchableHighlight>
            <TouchableHighlight
              onPress={() => this.closeModal('battleCancel')}
              style={styles.touchableHighlight}
              underlayColor={'#f1f1f1'}>
              <Text style={[styles.text, {color: 'orange'}]}> 예 </Text>
            </TouchableHighlight>
          </View>
        </View>
      </TouchableOpacity>
    ) : this.props.battleState === '배틀요청' ||
      this.props.battleState === '"배틀요청"' ? (
      <TouchableOpacity
        activeOpacity={1}
        disabled={true}
        style={styles.contentContainer}>
        <View style={[styles.battleModal, {width: this.state.width - 80}]}>
          <View style={styles.textView}>
            <Text style={[styles.text, {color: 'black'}, {fontSize: 20}]}>
              배틀요청 수락
            </Text>
            <Text style={styles.text}>
              {' '}
              배틀요청을 수락 하시겠습니까?{'\n'} 배틀코인 1개가 차감 됩니다.{' '}
            </Text>
          </View>
          <View style={styles.buttonView}>
            <TouchableHighlight
              onPress={() => this.closeModal('Cancel')}
              style={styles.touchableHighlight}
              underlayColor={'#f1f1f1'}>
              <Text style={[styles.text, {color: 'red'}]}> 취소 </Text>
            </TouchableHighlight>
            <TouchableHighlight
              onPress={() => this.closeModal('requestOK')}
              style={styles.touchableHighlight}
              underlayColor={'#f1f1f1'}>
              <Text style={[styles.text, {color: 'orange'}]}> 수락 </Text>
            </TouchableHighlight>
          </View>
        </View>
      </TouchableOpacity>
    ) : this.props.battleState === '배틀종료' &&
      this.props.isRandomBox === '' ? ( // 평가하기
      <TouchableOpacity
        activeOpacity={1}
        disabled={true}
        style={styles.contentContainer}>
        <View style={[styles.ratingModal, {width: this.state.width - 80}]}>
          <View style={styles.titleView}>
            <Text style={[styles.ratingText, {color: 'black'}, {fontSize: 30}]}>
              배틀결과
            </Text>
            <Text style={styles.ratingText}> 1. 승패를 선택해주세요. </Text>
            <View style={styles.imageContainer}>
              <TouchableOpacity
                onPress={() => this.setState({battleResult: 'win'})}
                style={
                  this.state.battleResult === 'win'
                    ? styles.imageBtnSelect
                    : styles.imageBtnUnSelect
                }>
                <Image
                  style={styles.image}
                  source={
                    this.state.battleResult === 'win'
                      ? require(`../assets/drawable-xxhdpi/icon_winner_wh.png`)
                      : require(`../assets/drawable-xxhdpi/icon_winner_or.png`)
                  }
                />
                <Text
                  style={
                    this.state.battleResult === 'win'
                      ? styles.textSelect
                      : styles.textUnSelect
                  }>
                  승
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => this.setState({battleResult: 'lose'})}
                style={
                  this.state.battleResult === 'lose'
                    ? styles.imageBtnSelect
                    : styles.imageBtnUnSelect
                }>
                <Image
                  style={styles.image}
                  source={
                    this.state.battleResult === 'lose'
                      ? require(`../assets/drawable-xxhdpi/icon_loser_wh.png`)
                      : require(`../assets/drawable-xxhdpi/icon_loser_or.png`)
                  }
                />
                <Text
                  style={
                    this.state.battleResult === 'lose'
                      ? styles.textSelect
                      : styles.textUnSelect
                  }>
                  패
                </Text>
              </TouchableOpacity>
            </View>
            <Text style={styles.ratingText}>
              {' '}
              2. 상대방 별점을 선택해주세요.{' '}
            </Text>

            <View style={styles.ratingContainer}>
              <TouchableOpacity onPress={() => this.setState({rating: 1})}>
                <Image
                  style={styles.image}
                  source={require(`../assets/drawable-xxhdpi/icon_star_copy_4.png`)}
                />
              </TouchableOpacity>
              <TouchableOpacity onPress={() => this.setState({rating: 2})}>
                {this.state.rating < 2 ? (
                  <Image
                    style={styles.image}
                    source={require(`../assets/drawable-xxhdpi/icon_star_copy_8.png`)}
                  />
                ) : (
                  <Image
                    style={styles.image}
                    source={require(`../assets/drawable-xxhdpi/icon_star_copy_4.png`)}
                  />
                )}
              </TouchableOpacity>
              <TouchableOpacity onPress={() => this.setState({rating: 3})}>
                {this.state.rating < 3 ? (
                  <Image
                    style={styles.image}
                    source={require(`../assets/drawable-xxhdpi/icon_star_copy_8.png`)}
                  />
                ) : (
                  <Image
                    style={styles.image}
                    source={require(`../assets/drawable-xxhdpi/icon_star_copy_4.png`)}
                  />
                )}
              </TouchableOpacity>
              <TouchableOpacity onPress={() => this.setState({rating: 4})}>
                {this.state.rating < 4 ? (
                  <Image
                    style={styles.image}
                    source={require(`../assets/drawable-xxhdpi/icon_star_copy_8.png`)}
                  />
                ) : (
                  <Image
                    style={styles.image}
                    source={require(`../assets/drawable-xxhdpi/icon_star_copy_4.png`)}
                  />
                )}
              </TouchableOpacity>
              <TouchableOpacity onPress={() => this.setState({rating: 5})}>
                {this.state.rating < 5 ? (
                  <Image
                    style={styles.image}
                    source={require(`../assets/drawable-xxhdpi/icon_star_copy_8.png`)}
                  />
                ) : (
                  <Image
                    style={styles.image}
                    source={require(`../assets/drawable-xxhdpi/icon_star_copy_4.png`)}
                  />
                )}
              </TouchableOpacity>
            </View>
          </View>
          <View style={styles.ratingBtnView}>
            <TouchableHighlight
              onPress={() => {
                this.state.battleResult === ''
                  ? this.refs.toast.show('승패를 선택해주세요!')
                  : this.closeModal('start');
              }}
              style={styles.ratingBtn}
              underlayColor={'#f1f1f1'}>
              <Text style={[styles.text, {color: TINT_COLOR}]}> 평가하기 </Text>
            </TouchableHighlight>
          </View>
        </View>
        <Toast
          ref="toast"
          style={{backgroundColor: BG_COLOR}}
          position="bottom"
          positionValue={100}
          fadeInDuration={750}
          fadeOutDuration={1500}
          opacity={1}
          textStyle={{color: TINT_COLOR}}
        />
      </TouchableOpacity>
    ) : this.props.battleState === '배틀종료' &&
      this.props.isRandomBox === 'start' ? (
      <TouchableOpacity
        activeOpacity={1}
        disabled={true}
        style={styles.contentContainer}>
        <View style={[styles.imgModal, {width: this.state.width - 80}]}>
          <View style={styles.imgTitleView}>
            <Text style={[styles.ratingText, {color: 'black'}, {fontSize: 30}]}>
              배틀완료
            </Text>
            <Text style={styles.ratingText}> 랜덤 박스를 오픈하세요. </Text>
            <View style={styles.imageContainer}>
              <TouchableOpacity onPress={() => this.closeModal('random')}>
                <Image
                  style={styles.imgRandomBox}
                  source={require(`../assets/drawable-xxhdpi/img_randombox.png`)}
                />
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </TouchableOpacity>
    ) : this.props.battleState === '배틀종료' &&
      (this.props.isRandomBox === 'success' ||
        this.props.isRandomBox === 'success2' ||
        this.props.isRandomBox === 'success3' ||
        this.props.isRandomBox === 'success4' ||
        this.props.isRandomBox === 'success5' ||
        this.props.isRandomBox === 'success6' ||
        this.props.isRandomBox === 'success7') ? (
      <TouchableOpacity
        activeOpacity={1}
        disabled={true}
        style={styles.contentContainer}>
        <View style={[styles.ratingModal, {width: this.state.width - 80}]}>
          <View style={styles.imgTitleView}>
            <Text style={[styles.ratingText, {color: 'black'}, {fontSize: 30}]}>
              배틀완료
            </Text>
            {this.props.isRandomBox === 'success' ? (
              <>
                <Text style={styles.ratingText}> 코인 당첨! </Text>
                <View style={styles.imageContainer}>
                  <TouchableOpacity>
                    <Image
                      style={styles.img}
                      source={require(`../assets/drawable-xxhdpi/img_coin.png`)}
                    />
                  </TouchableOpacity>
                </View>
              </>
            ) : this.props.isRandomBox === 'success2' ? (
              <>
                <Text style={styles.ratingText}> 게토레이 당첨! </Text>
                <View style={styles.imageContainer}>
                  <TouchableOpacity>
                    <Image
                      style={styles.img}
                      source={require(`../assets/drawable-xxhdpi/img_gatorade.png`)}
                    />
                  </TouchableOpacity>
                </View>
              </>
            ) : this.props.isRandomBox === 'success3' ? (
              <>
                <Text style={styles.ratingText}> 닥터유 에너지바 당첨! </Text>
                <View style={styles.imageContainer}>
                  <TouchableOpacity>
                    <Image
                      style={styles.img}
                      source={require(`../assets/drawable-xxhdpi/img_dryou.png`)}
                    />
                  </TouchableOpacity>
                </View>
              </>
            ) : this.props.isRandomBox === 'success4' ? (
              <>
                <Text style={styles.ratingText}>
                  {' '}
                  파워에이드pet 600ml 당첨!{' '}
                </Text>
                <View style={styles.imageContainer}>
                  <TouchableOpacity>
                    <Image
                      style={styles.img}
                      source={require(`../assets/drawable-xxhdpi/img_powerade.png`)}
                    />
                  </TouchableOpacity>
                </View>
              </>
            ) : this.props.isRandomBox === 'success5' ? (
              <>
                <Text style={styles.ratingText}>
                  {' '}
                  스타벅스 아메리카노(ICE){' '}
                </Text>
                <View style={styles.imageContainer}>
                  <TouchableOpacity>
                    <Image
                      style={styles.img}
                      source={require(`../assets/drawable-xxhdpi/img_starbucks.png`)}
                    />
                  </TouchableOpacity>
                </View>
              </>
            ) : this.props.isRandomBox === 'success6' ? (
              <>
                <Text style={styles.ratingText}> 베스킨라빈스 파인트 </Text>
                <View style={styles.imageContainer}>
                  <TouchableOpacity>
                    <Image
                      style={styles.img}
                      source={require(`../assets/drawable-xxhdpi/img_baskin.png`)}
                    />
                  </TouchableOpacity>
                </View>
              </>
            ) : (
              <>
                <Text style={styles.ratingText}>
                  {' '}
                  bbq 황금올리브치킨 반반 + 콜라 1.25L{' '}
                </Text>
                <View style={styles.imageContainer}>
                  <TouchableOpacity>
                    <Image
                      style={styles.img}
                      source={require(`../assets/drawable-xxhdpi/img_bbq.png`)}
                    />
                  </TouchableOpacity>
                </View>
              </>
            )}
          </View>
          <View style={styles.ratingBtnView}>
            {this.props.isRandomBox === 'success' ? (
              <TouchableHighlight
                onPress={() => {
                  this.closeModal('Cancel');
                }}
                style={styles.ratingBtn}
                underlayColor={'#f1f1f1'}>
                <Text style={[styles.text, {color: TINT_COLOR}]}> 확인 </Text>
              </TouchableHighlight>
            ) : (
              <TouchableHighlight
                onPress={() => {
                  this.closeModal('Channel');
                }}
                style={styles.ratingBtn}
                underlayColor={'#f1f1f1'}>
                <Text style={[styles.text, {color: TINT_COLOR}]}> 받기 </Text>
              </TouchableHighlight>
            )}
          </View>
          {this.props.isRandomBox === 'success' ? (
            <Text style={styles.imgMiniText}> 코인 1개가 추가되었습니다. </Text>
          ) : (
            <Text style={styles.imgMiniText}>
              {' '}
              관리자 카카오채널로 연결됩니다.{' '}
            </Text>
          )}
        </View>
      </TouchableOpacity>
    ) : this.props.battleState === '배틀종료' &&
      this.props.isRandomBox === 'fail' ? (
      <TouchableOpacity
        activeOpacity={1}
        disabled={true}
        style={styles.contentContainer}>
        <View style={[styles.loseModal, {width: this.state.width - 80}]}>
          <View style={styles.imgTitleView}>
            <Text style={[styles.ratingText, {color: 'black'}, {fontSize: 30}]}>
              배틀완료
            </Text>
            <Text style={styles.ratingText}>
              {' '}
              아쉬워요 ㅠㅠ{'\n'}다음 기회에 도전 !{' '}
            </Text>
            {/* <View style={styles.imageContainer}>
              <TouchableOpacity>
                <Image
                  style={styles.img}
                  source={require(`../assets/drawable-xxhdpi/img_loseorange.png`)}
                />
              </TouchableOpacity>
            </View> */}
          </View>
          <View style={styles.ratingBtnView}>
            <TouchableHighlight
              onPress={() => {
                this.closeModal('Cancel');
              }}
              style={styles.ratingBtn}
              underlayColor={'#f1f1f1'}>
              <Text style={[styles.text, {color: TINT_COLOR}]}> 확인 </Text>
            </TouchableHighlight>
          </View>
        </View>
      </TouchableOpacity>
    ) : (
      // 배틀 종료
      <TouchableOpacity
        activeOpacity={1}
        disabled={true}
        style={styles.contentContainer}>
        <View style={[styles.battleModal, {width: this.state.width - 80}]}>
          <View style={styles.textView}>
            <Text style={[styles.text, {color: 'black'}, {fontSize: 20}]}>
              배틀종료 및 평가
            </Text>
            <Text style={styles.text}> 배틀을 종료하고 평가하시겠습니까? </Text>
          </View>
          <View style={styles.buttonView}>
            <TouchableHighlight
              onPress={() => this.closeModal('Cancel')}
              style={styles.touchableHighlight}
              underlayColor={'#f1f1f1'}>
              <Text style={[styles.text, {color: 'red'}]}> 아니요 </Text>
            </TouchableHighlight>
            <TouchableHighlight
              onPress={() => this.closeModal('battleEnd')}
              style={styles.touchableHighlight}
              underlayColor={'#f1f1f1'}>
              <Text style={[styles.text, {color: 'orange'}]}> 예 </Text>
            </TouchableHighlight>
          </View>
        </View>
      </TouchableOpacity>
    );
  }
}

const styles = StyleSheet.create({
  img: {
    marginTop: 20,
    width: 200,
    height: 200,
  },
  imgMiniText: {
    color: GREY_COLOR3,
    fontSize: 12,
    alignItems: 'center',
    alignSelf: 'center',
    margin: 10,
  },
  imgModal: {
    height: (Layout.height * 2) / 3.5,
    paddingTop: 10,
    paddingLeft: 20,
    paddingRight: 20,
    alignSelf: 'center',
    alignItems: 'flex-start',
    textAlign: 'center',
    backgroundColor: 'white',
    borderColor: 'orange',
    borderWidth: 2,
    borderRadius: 10,
  },
  imgTitleView: {
    flex: 1,
    alignSelf: 'stretch',
    alignItems: 'center',
    marginTop: 10,
  },
  imgRandomBox: {
    marginTop: 20,
    width: 160,
    height: 244,
  },
  contentContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  modal: {
    height: Layout.height / 6,
    paddingTop: 10,
    alignSelf: 'center',
    alignItems: 'center',
    textAlign: 'center',
    backgroundColor: 'white',
    borderColor: 'orange',
    borderWidth: 1,
    borderRadius: 10,
  },
  battleModal: {
    height: Layout.height / 5,
    paddingTop: 10,
    alignSelf: 'center',
    alignItems: 'center',
    textAlign: 'center',
    backgroundColor: 'white',
    borderColor: 'orange',
    borderWidth: 1,
    borderRadius: 10,
  },
  battleStartModal: {
    height: Layout.height / 4.5,
    paddingTop: 10,
    alignSelf: 'center',
    alignItems: 'center',
    textAlign: 'center',
    backgroundColor: 'white',
    borderColor: 'orange',
    borderWidth: 1,
    borderRadius: 10,
  },
  ratingModal: {
    height: (Layout.height * 2) / 3,
    paddingTop: 10,
    paddingLeft: 20,
    paddingRight: 20,
    alignSelf: 'center',
    alignItems: 'flex-start',
    textAlign: 'center',
    backgroundColor: 'white',
    borderColor: 'orange',
    borderWidth: 2,
    borderRadius: 10,
  },
  loseModal: {
    height: Layout.height / 3,
    paddingTop: 10,
    paddingLeft: 20,
    paddingRight: 20,
    alignSelf: 'center',
    alignItems: 'flex-start',
    textAlign: 'center',
    backgroundColor: 'white',
    borderColor: 'orange',
    borderWidth: 2,
    borderRadius: 10,
  },
  passwordModal: {
    height: Layout.height / 2.5,
    paddingTop: 10,
    paddingLeft: 20,
    paddingRight: 20,
    alignSelf: 'center',
    alignItems: 'flex-start',
    textAlign: 'center',
    backgroundColor: 'white',
    borderColor: 'orange',
    borderWidth: 2,
    borderRadius: 10,
  },
  titleView: {
    flex: 1,
    alignSelf: 'stretch',
    alignItems: 'flex-start',
    marginTop: 10,
  },
  ratingText: {
    marginTop: 10,
    marginLeft: 5,
    marginRight: 5,
    marginBottom: 15,
    fontSize: 16,
    fontWeight: 'bold',
  },
  imageContainer: {
    width: '100%',
    flexDirection: 'row',
    alignSelf: 'stretch',
    alignItems: 'center',
    justifyContent: 'space-around',
    marginBottom: 20,
    // backgroundColor: 'royalblue',
  },
  imageBtnSelect: {
    width: 120,
    height: 120,
    backgroundColor: BG_COLOR,
    padding: 10,
    alignSelf: 'center',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 60,
  },
  imageBtnUnSelect: {
    width: 120,
    height: 120,
    backgroundColor: TINT_COLOR,
    borderColor: BG_COLOR,
    borderWidth: 1,
    padding: 10,
    alignSelf: 'center',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 60,
  },
  image: {
    width: 43,
    height: 40,
  },
  textSelect: {
    color: TINT_COLOR,
    fontSize: 25,
    fontWeight: 'bold',
    paddingTop: 10,
  },
  textUnSelect: {
    color: BG_COLOR,
    fontSize: 25,
    fontWeight: 'bold',
    paddingTop: 10,
  },
  ratingBtnView: {
    width: '100%',
    flexDirection: 'row',
    marginBottom: 20,
  },
  ratingContainer: {
    width: '100%',
    flexDirection: 'row',
    alignSelf: 'stretch',
    alignItems: 'center',
    justifyContent: 'space-around',
    marginTop: 10,
    // backgroundColor: 'royalblue',
  },
  ratingBtn: {
    flex: 1,
    backgroundColor: BG_COLOR,
    paddingVertical: 10,
    alignSelf: 'stretch',
    alignItems: 'center',
    borderRadius: 10,
  },
  text: {
    margin: 5,
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  textPS: {
    margin: 10,
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  textInput: {
    padding: 5,
    marginBottom: 10,
    fontSize: 16,
    justifyContent: 'flex-start',
    alignSelf: 'stretch',
    fontWeight: 'bold',
    // textAlign: 'center',
    borderWidth: 1,
    borderColor: BG_COLOR,
  },
  touchableHighlight: {
    flex: 1,
    backgroundColor: 'white',
    paddingVertical: 10,
    alignSelf: 'stretch',
    alignItems: 'center',
    borderRadius: 10,
  },
  textView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 10,
  },
  buttonView: {
    width: '100%',
    flexDirection: 'row',
    // borderTopWidth: 1,
    // borderColor: GREY_COLOR,
  },
});
