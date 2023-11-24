import React from 'react';
import {View, Text} from 'react-native';
import {Card} from '@ant-design/react-native';
import {red} from '@ant-design/colors';

function SingleCard(props) {
  const title = props.title;
  const expireDate = props.expireDate;

  return (
    <View style={{width: 300, padding: 20}}>
      <Card>
        <Card.Header title={title} />
        <Card.Body>
          <View style={{height: 42}}>
            <Text style={{marginLeft: 16, color: red[4]}}>
              有効期限　{expireDate}
            </Text>
          </View>
        </Card.Body>
      </Card>
    </View>
  );
}

export default SingleCard;
