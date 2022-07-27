import { RouteProp, useNavigation, useRoute } from "@react-navigation/native";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  Modal,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import styles from "./styles";
import { Feather } from "@expo/vector-icons";
import { api } from "../../services/api";
import ModalPicker from "../../components/ModalPicker";
import ListItem from "../../components/ListItem";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { StackParamsList } from "../../routes/app.routes";

type RouterDetailParams = {
  Order: { number: string | number; order_id: string };
};

type OrderRouteProps = RouteProp<RouterDetailParams, "Order">;

type CategoryProps = {
  id: string;
  name: string;
};

type ProductProps = {
  id: string;
  name: string;
};

type ItemProps = {
  id: string;
  product_id: string;
  name: string;
  amount: string | number;
};

export default function Order() {
  const route = useRoute<OrderRouteProps>();
  const navigation =
    useNavigation<NativeStackNavigationProp<StackParamsList>>();
  const [loadingDeleteOrder, setLoadingDeleteOrder] = useState(false);
  const [category, setCategory] = useState<CategoryProps[] | []>([]);
  const [categorySelected, setCategorySelected] = useState<
    CategoryProps | undefined
  >();
  const [amount, setAmount] = useState("1");
  const [modalCategoryVis, setModalCategoryVis] = useState(false);
  const [products, setProducts] = useState<ProductProps[] | []>([]);
  const [productSelected, setProductSelected] = useState<
    ProductProps | undefined
  >();
  const [modalProductVis, setModalProductVis] = useState(false);
  const [items, setItems] = useState<ItemProps[]>([]);

  useEffect(() => {
    try {
      async function loadInfo() {
        const res = await api.get("/category");
        setCategory(res.data);
        setCategorySelected(res.data[0]);
      }
      loadInfo();
    } catch (err) {
      console.log("erro loadInfo" + err);
      throw err;
    }
  }, []);

  //quando selecionar uma categoria
  useEffect(() => {
    if (categorySelected) {
      try {
        async function loadProducts() {
          const res = await api.get("/category/product", {
            params: { category_id: categorySelected?.id },
          });

          setProducts(res.data);
          setProductSelected(res.data[0]);
        }
        loadProducts();
      } catch (err) {
        console.log("erro loadProducts:" + err);
        throw err;
      }
    }
  }, [categorySelected]);

  async function handleCloseOrder() {
    if (!loadingDeleteOrder) {
      setLoadingDeleteOrder(true);
      try {
        await api.delete("/order", {
          params: { order_id: route.params?.order_id },
        });

        navigation.goBack();
        setLoadingDeleteOrder(false);
      } catch (err) {
        console.log(err);
        setLoadingDeleteOrder(false);
      }
    }
  }

  function handleChangeCategory(item: CategoryProps) {
    setCategorySelected(item);
  }

  function handleChangeProduct(item: ProductProps) {
    setProductSelected(item);
  }

  async function handleAdd() {
    if (productSelected) {
      const res = await api.post("/order/add", {
        order_id: route.params?.order_id,
        product_id: productSelected?.id,
        amount: Number(amount),
      });

      let data: ItemProps = {
        id: res.data.id,
        product_id: productSelected.id as string,
        name: productSelected.name as string,
        amount,
      };

      setItems((oldArray) => [...oldArray, data]);
    }
  }

  async function handleDeleteItem(item_id: string) {
    try {
      await api.delete("/order/remove", { params: { item_id } });

      let removeItem = items.filter((item) => {
        return item.id !== item_id;
      });

      setItems(removeItem);
    } catch (err) {
      console.log(err);
    }
  }

  async function handleFinishOrder() {
    navigation.navigate("FinishOrder", {
      number: route.params?.number,
      order_id: route.params?.order_id,
    });
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Mesa {route.params.number}</Text>
        {items.length === 0 && (
          <TouchableOpacity onPress={handleCloseOrder}>
            {loadingDeleteOrder ? (
              <ActivityIndicator size={25} color="#fff"></ActivityIndicator>
            ) : (
              <Feather name="trash-2" size={28} color="#ff3f4b"></Feather>
            )}
          </TouchableOpacity>
        )}
      </View>
      {category.length !== 0 && (
        <TouchableOpacity
          style={styles.input}
          onPress={() => setModalCategoryVis(true)}
        >
          <Text style={{ color: "#fff" }}>{categorySelected?.name}</Text>
        </TouchableOpacity>
      )}

      {products.length !== 0 && (
        <TouchableOpacity
          style={styles.input}
          onPress={() => setModalProductVis(true)}
        >
          <Text style={{ color: "#fff" }}>{productSelected?.name}</Text>
        </TouchableOpacity>
      )}

      <View style={styles.qtdContainer}>
        <Text style={styles.qtdText}>Quantidade</Text>
        <TextInput
          style={[styles.input, { width: "60%", textAlign: "center" }]}
          value={amount}
          onChangeText={setAmount}
          placeholderTextColor={"#f0f0f0"}
          keyboardType="numeric"
        ></TextInput>
      </View>

      <View style={styles.action}>
        <TouchableOpacity style={styles.buttonAdd} onPress={handleAdd}>
          <Text style={styles.buttonText}>+</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.button, { opacity: items.length === 0 ? 0.3 : 1 }]}
          disabled={items.length === 0}
          onPress={handleFinishOrder}
        >
          <Text style={styles.buttonText}>Avançar</Text>
        </TouchableOpacity>
      </View>

      <FlatList
        showsVerticalScrollIndicator={false}
        style={{ flex: 1, marginTop: 24 }}
        data={items}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <ListItem data={item} deleteItem={handleDeleteItem}></ListItem>
        )}
      ></FlatList>

      <Modal transparent={true} visible={modalCategoryVis} animationType="fade">
        <ModalPicker
          handleCloseModal={() => setModalCategoryVis(false)}
          options={category}
          selectedItem={handleChangeCategory}
        ></ModalPicker>
      </Modal>

      <Modal transparent={true} visible={modalProductVis} animationType="fade">
        <ModalPicker
          handleCloseModal={() => setModalProductVis(false)}
          options={products}
          selectedItem={handleChangeProduct}
        ></ModalPicker>
      </Modal>
    </View>
  );
}
