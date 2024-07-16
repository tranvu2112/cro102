import React, { useState } from 'react';
import { SafeAreaView, StyleSheet, Text, View, FlatList, TouchableOpacity, TextInput, Alert, Modal, Image, StatusBar, Pressable } from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import { addTodo, deleteTodo, updateTodo, toggleTodoStatus } from '../redux/reducers/todoReducers';

const Index = () => {
    const todos = useSelector((state) => state.listTodo.listTodo);
    const dispatch = useDispatch();

    const [newTitle, setNewTitle] = useState('');
    const [newContent, setNewContent] = useState('');
    const [editingId, setEditingId] = useState(null);
    const [modalVisible, setModalVisible] = useState(false);
    const [selectedTodo, setSelectedTodo] = useState(null);
    const [addModalVisible, setAddModalVisible] = useState(false);
    const [updateModalVisible, setUpdateModalVisible] = useState(false);

    const initialCount = {
        completed: todos.filter(todo => todo.status).length,
        uncompleted: todos.filter(todo => !todo.status).length,
    };

    const addTodoHandler = () => {
        if (newTitle.trim() === '' || newContent.trim() === '') {
            Alert.alert('Tiêu đề và nội dung không được để trống.');
            return;
        }
        const newTodo = {
            id: (todos.length + 1).toString(),
            title: newTitle,
            content: newContent,
            status: false,
        };
        dispatch(addTodo(newTodo));
        setNewTitle('');
        setNewContent('');
        setAddModalVisible(false);
    };

    const deleteTodoHandler = (task) => {
        Alert.alert('Confirm Dialog', `Bạn có muốn xóa ${task.title} không?`, [
            { text: 'Cancel', style: 'cancel' },
            {
                text: 'OK',
                onPress: () => {
                    dispatch(deleteTodo(task.id));
                },
            },
        ]);
    };

    const updateTodoHandler = () => {
        const updatedTodo = {
            id: editingId,
            title: newTitle,
            content: newContent,
        };
        dispatch(updateTodo(updatedTodo));
        setNewTitle('');
        setNewContent('');
        setEditingId(null);
        setUpdateModalVisible(false);
    };

    const toggleTodoHandler = (id) => {
        dispatch(toggleTodoStatus(id));
    };

    const openModal = (item) => {
        setSelectedTodo(item);
        setModalVisible(true);
    };

    const closeModal = () => {
        setModalVisible(false);
        setSelectedTodo(null);
    };

    const handleLongPress = (item) => {
        setNewTitle(item.title);
        setNewContent(item.content);
        setEditingId(item.id);
        setUpdateModalVisible(true);
    };

    const renderItem = ({ item }) => (
        <TouchableOpacity style={{ marginTop: 5 }} onPress={() => openModal(item)} onLongPress={() => handleLongPress(item)}>
            <View style={styles.todoItem}>
                <Text style={[styles.todoTitle, item.status && styles.completed]}>{item.title}</Text>
                <TouchableOpacity onPress={() => toggleTodoHandler(item.id)}>
                    <Image source={item.status ? require('../icon/checked.png') : require('../icon/unchecked.png')} />
                </TouchableOpacity>
                <TouchableOpacity style={{ marginLeft: 10 }} onPress={() => deleteTodoHandler(item)}>
                    <Image style={{ color: 'brown' }} source={require('../icon/recycle-bin.png')} />
                </TouchableOpacity>
            </View>
        </TouchableOpacity>
    );

    return (
        <SafeAreaView style={styles.container}>
            <StatusBar backgroundColor="transparent" translucent barStyle="dark-content" />
            <Text style={styles.header}>Manage Jobs</Text>
            <Text style={styles.counter}>Đã xong: {initialCount.completed}</Text>
            <Text style={styles.counter}>Chưa xong: {initialCount.uncompleted}</Text>

            <FlatList
                data={todos}
                renderItem={renderItem}
                keyExtractor={(item) => item.id.toString()}
                contentContainerStyle={{ paddingBottom: 50 }}
            />
            <Pressable style={styles.addButton} onPress={() => {
                setAddModalVisible(true)
            }}>
                <Text style={{ fontSize: 40, color: 'white' }}>+</Text>
            </Pressable>
            {selectedTodo && (
                <Modal animationType="fade" transparent={true} visible={modalVisible} onRequestClose={closeModal}>
                    <View style={styles.modalView}>
                        <View style={styles.modalBlock}>
                            <Text style={styles.modalTitle}>{selectedTodo.title}</Text>
                            <View style={{ backgroundColor: '#F0F4C3', borderRadius: 10, borderWidth: 1, alignItems: 'center', justifyContent: 'center', padding: 20 }}>
                                <Text style={styles.modalContent}>Content: {selectedTodo.content}</Text>
                            </View>
                            <View style={{ flexDirection: 'row', marginTop: 15 }}>
                                <TouchableOpacity style={styles.btnTask} onPress={closeModal}>
                                    <Text style={styles.btnText}>Close</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    </View>
                </Modal>
            )}
            <Modal animationType="slide" transparent={true} visible={addModalVisible} onRequestClose={() => setAddModalVisible(false)}>
                <View style={styles.modalViewAdd}>
                    <View style={styles.modalBlockAdd}>
                        <Text style={styles.modalTitle}>Add New Task</Text>
                        <TextInput style={styles.input} placeholder="Title" onChangeText={setNewTitle} />
                        <TextInput style={styles.input} placeholder="Content" onChangeText={setNewContent} />
                        <View style={{ flexDirection: 'row' }}>
                            <TouchableOpacity onPress={addTodoHandler} style={styles.btnTask}>
                                <Text style={styles.btnText}>Add Task</Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={styles.btnTask} onPress={() => setAddModalVisible(false)}>
                                <Text style={styles.btnText}>Cancel</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </Modal>
            <Modal animationType="slide" transparent={true} visible={updateModalVisible} onRequestClose={() => setUpdateModalVisible(false)}>
                <View style={styles.modalViewAdd}>
                    <View style={styles.modalBlockAdd}>
                        <Text style={styles.modalTitle}>Update Task</Text>
                        <TextInput style={styles.input} placeholder="Title" value={newTitle} onChangeText={setNewTitle} />
                        <TextInput style={styles.input} placeholder="Content" value={newContent} onChangeText={setNewContent} />
                        <View style={{ flexDirection: 'row' }}>
                            <TouchableOpacity onPress={updateTodoHandler} style={styles.btnTask}>
                                <Text style={styles.btnText}>Update Task</Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={styles.btnTask} onPress={() => setUpdateModalVisible(false)}>
                                <Text style={styles.btnText}>Cancel</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </Modal>
        </SafeAreaView>
    );
};

export default Index;

const styles = StyleSheet.create({
    container: {
        backgroundColor: '#F0F4C3',
        flex: 1,
        padding: 20,
    },
    header: {
        fontSize: 40,
        fontWeight: 'bold',
        textAlign: 'center',
        marginVertical: 20,
        color: '#000',
    },
    counter: {
        color: 'white',
        fontWeight: '700',
        padding: 5,
        borderRadius: 10,
        fontSize: 20,
        backgroundColor: 'blue',
        textAlign: 'center',
        marginBottom: 20,
    },
    input: {
        backgroundColor: '#fff',
        borderWidth: 1,
        borderColor: 'black',
        borderRadius: 10,
        padding: 10,
        marginBottom: 15,
        fontSize: 18,
        width: '100%',
        elevation: 7,
    },
    todoItem: {
        justifyContent: 'space-between',
        alignItems: 'center',
        flexDirection: 'row',
        padding: 15,
        borderWidth: 1,
        borderColor: 'blue',
        borderRadius: 5,
        marginBottom: 5,
    },
    todoTitle: {
        flex: 2,
        fontSize: 18,
        fontWeight: 'bold',
        color: 'brown',
    },
    completed: {
        textDecorationLine: 'line-through',
        color: 'gray',
    },
    modalView: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    modalViewAdd: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    modalTitle: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 15,
        textAlign: 'center',
    },
    modalBlock: {
        width: '98%',
        backgroundColor: '#fff',
        padding: 20,
        borderRadius: 10,
        alignItems: 'center',
    },
    modalBlockAdd: {
        borderWidth: 1,
        width: '98%',
        backgroundColor: '#d7f9fa',
        padding: 20,
        alignItems: 'center',
        position: 'absolute',
        borderRadius: 10,
        marginHorizontal: 10,
    },
    modalContent: {
        fontWeight: '700',
        fontSize: 16,
        textAlign: 'justify',
        marginBottom: 20,
    },
    addButton: {
        width: 50,
        borderRadius: 20,
        alignItems: 'center',
        backgroundColor: 'blue',
        position: 'absolute',
        bottom: 20,
        right: 20,
    },
    btnTask: {
        backgroundColor: '#fff',
        padding: 10,
        marginEnd: 10,
        elevation: 7,
        borderRadius: 10,
        borderColor: 'black',
        borderWidth: 1,
    },
    btnText: {
        fontWeight: '700',
    },
});
