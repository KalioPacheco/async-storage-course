import { useState, useEffect } from "react"
import { View, TextInput, Button, Text } from "react-native";
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function Home() {

  const [text, setText] = useState("");
  const [palabras, setPalabras] = useState<string[]>([])
  const [indexAEditar, setIndexAEditar] = useState<number>(-1)
  const [textoAEditar, setTextoAEditar] = useState<string>("")

  // CRUD
  async function create(list: string[]): Promise<boolean> {
    try {
      await AsyncStorage.setItem("lista", JSON.stringify(list))
      return true;
    } catch {
      return false;
    }
  }

  async function read(): Promise<string[]> {
    const cadenaDeTexto = await AsyncStorage.getItem("lista");
    if (cadenaDeTexto) {
      return JSON.parse(cadenaDeTexto);
    }
    return []
  }

  async function update(list: string[]): Promise<boolean> {
    try {
      await AsyncStorage.setItem("lista", JSON.stringify(list))
      return true;
    } catch {
      return false;
    }
  }

  async function remove() {
    try {
      await AsyncStorage.removeItem("lista");
      return true;
    } catch {
      return false;
    }
  }

  async function agregarPalabra() {
    // truthy y falsy
    if (text) {
      const list = await read();
      list.push(text);
      setText("");
      update(list);
      setPalabras(list)
    }
  }

  async function initialFunction() {
    const list = await read();
    setPalabras(list)
  }

  async function removerElemento(posicion: number) {
    const list = await read();
    list.splice(posicion, 1);
    setPalabras(list);
    update(list)
  }

  async function editarItem() {
    const list = await read();
    list[indexAEditar] = textoAEditar;
    setPalabras(list);
    setIndexAEditar(-1);
    setTextoAEditar("");
    update(list)
  }

  async function eliminarTodo() {
    await remove();
    setPalabras([])
  }

  useEffect(
    () => {
      initialFunction()
    }, // callback 
    [] // array de dependencias
  )

  return (
    <View
      style={{
        flex: 1
      }}
    >
      <View
        style={{
          flex: 1
        }}
      >
        {
          palabras.map(
            (current, index) => {
              return (
                <View key={index}
                  style={{
                    flexDirection: "row"
                  }}
                >
                  {
                    indexAEditar === index ?
                      <TextInput
                        value={textoAEditar}
                        onChangeText={(newText) => setTextoAEditar(newText)}
                        placeholder="Ingresa texto"
                        style={{
                          flex: 1,
                          fontSize: 30
                        }}
                      />
                      :
                      <Text
                        style={{
                          fontSize: 30,
                          flex: 1
                        }}
                      >{current}</Text>
                  }
                  <View
                    style={{
                      flexDirection: "row"
                    }}
                  >
                    {
                      index === indexAEditar ?
                        <Button
                          title="Guardar"
                          color="blue"
                          onPress={editarItem}
                        />
                        :
                        <Button
                          title="Editar"
                          color="blue"
                          onPress={() => {
                            setIndexAEditar(index)
                            setTextoAEditar(current)
                          }}
                        />
                    }
                    <Button
                      title="Eliminar"
                      color="red"
                      onPress={() => removerElemento(index)}
                    />
                  </View>
                </View>
              )
            }
          )
        }
      </View>

      <View
        style={{
          flexDirection: "row",
        }}
      >
        <TextInput
          style={{
            fontSize: 30,
            flex: 1
          }}
          value={text}
          onChangeText={(newText) => setText(newText)}
          placeholder="Escribe una palabra"
          autoFocus={true}
        />
        <Button
          title="Añadir"
          color="green"
          onPress={agregarPalabra}
        />
      </View>
      <View
        style={{
          paddingBottom: 30
        }}
      >
        <Button 
          title="Eliminar todo"
          color="red"
          onPress={eliminarTodo}
        />
      </View>
    </View>
  )
}