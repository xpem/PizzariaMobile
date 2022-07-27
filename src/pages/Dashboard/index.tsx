import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import React, { useContext, useState } from "react";
import {
  ActivityIndicator,
  Button,
  SafeAreaView,  
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import styles from "./styles";
import { AuthContext } from "../../contexts/AuthContext";
import { StackParamsList } from "../../routes/app.routes";
import { api } from "../../services/api";

export default function Dashboard() {
  const { signOut } = useContext(AuthContext);
  const [number, setNumber] = useState("");
  const [loading, setLoading] = useState(false);

  const navigation =
    useNavigation<NativeStackNavigationProp<StackParamsList>>();

  async function openOrder() {
    setLoading(true);
    if (number === "") {
      return;
    }
    try {
      const res = await api.post("/order", { table: Number(number) });

      navigation.navigate("Order", { number, order_id: res.data.id });
    } catch (err) {
      console.log(err);
      setLoading(false);
    }

    setNumber("");
    setLoading(false);
  }

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>Novo Pedido</Text>
      <TextInput
        style={styles.input}
        keyboardType="numeric"
        placeholder="Número da mesa"
        placeholderTextColor={"#f0f0f0"}
        value={number}
        onChangeText={setNumber}
      ></TextInput>
      <TouchableOpacity style={styles.button} onPress={openOrder}>
        {loading ? (
          <ActivityIndicator size={25} color="#fff"></ActivityIndicator>
        ) : (
          <Text style={styles.buttonText}>Abrir Mesa</Text>
        )}
      </TouchableOpacity>
    </SafeAreaView>
  );
}

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     justifyContent: "center",
//     alignItems: "center",
//     paddingVertical: 15,
//     backgroundColor: "#1d1d2e",
//   },
//   title: { fontSize: 30, fontWeight: "bold", color: "#fff", marginBottom: 24 },
//   input: {
//     width: "90%",
//     height: 60,
//     backgroundColor: "#101026",
//     borderRadius: 4,
//     paddingHorizontal: 8,
//     textAlign: "center",
//     fontSize: 22,
//     color: "#fff",
//   },
//   button: {
//     width: "90%",
//     height: 40,
//     backgroundColor: "#3fffa3",
//     borderRadius: 4,
//     marginVertical: 12,
//     justifyContent: "center",
//     alignItems: "center",
//   },
//   buttonText: { fontSize: 18, color: "#101026", fontWeight: "bold" },
// });
