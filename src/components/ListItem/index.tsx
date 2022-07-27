import React from "react";
import { Text, TouchableOpacity, View } from "react-native";
import styles from "./styles";
import { Feather } from "@expo/vector-icons";

interface ItemProps {
  data: {
    id: string;
    product_id: string;
    name: string;
    amount: string | number;
  };
  deleteItem: (item_id: string) => void;
}

export default function ListItem({ data, deleteItem }: ItemProps) {
  function handleDelete() {
    deleteItem(data.id);
  }

  return (
    <View style={styles.container}>
      <Text style={styles.item}>
        {data.amount} - {data.name}
      </Text>
      <TouchableOpacity onPress={handleDelete}>
        <Feather name="trash-2" color={"#ff3f4b"} size={25}></Feather>
      </TouchableOpacity>
    </View>
  );
}
