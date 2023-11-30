import React from 'react';
import {View, Text} from 'react-native';
import {Card, Button} from '@ant-design/react-native';
import {red, gray, blue} from '@ant-design/colors';

function SingleCard(props) {
  const index = props.index;
  const title = props.title;
  const expireDate = props.expireDate;
  const setShowEditPopup = props.setShowEditPopup;
  const setEditIndex = props.setEditIndex;
  const nextPresent = props.benefitName;
  const tag = props.tag;
  const [remainingCount, setRemainingCount] = React.useState(
    props.benefitCount,
  );

  return (
    <View style={{width: 300, padding: 10}}>
      <Card>
        <Card.Header
          title={title}
          extra={
            <Text
              style={{marginLeft: 96, color: blue.primary}}
              onPress={() => {
                setEditIndex(index);
                setShowEditPopup(true);
              }}>
              編集
            </Text>
          }
        />
        <Card.Body>
          <View style={{height: 42}}>
            <Text style={{marginLeft: 16, color: gray[6]}}>
              次回特典の「{nextPresent}」まで
            </Text>
          </View>
          <View style={{height: 42, flexDirection: 'row'}}>
            <Text style={{marginLeft: 96, marginRight: 16, color: gray[6]}}>
              あと
            </Text>
            <Button
              size="small"
              style={{backgroundColor: gray[0]}}
              onPress={() => {
                if (remainingCount > 0) {
                  setRemainingCount(remainingCount - 1);
                }
              }}>
              ー
            </Button>
            <Text style={{marginLeft: 16, marginRight: 16, color: gray[6]}}>
              {remainingCount}
            </Text>
            <Button
              size="small"
              style={{backgroundColor: gray[0]}}
              onPress={() => setRemainingCount(remainingCount + 1)}>
              ＋
            </Button>
          </View>
          <View style={{height: 20}}>
            <Text style={{marginLeft: 16, color: red[4]}}>
              有効期限　{expireDate}
            </Text>
          </View>

          <View style={{marginTop: 8, height: tag !== null ? 20 : 0}}>
            <Text style={{marginLeft: 16, color: gray[4]}}>#{tag}</Text>
          </View>
        </Card.Body>
      </Card>
    </View>
  );
}

export default SingleCard;
