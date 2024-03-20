import { Button, Card, Layout, Menu, Spin, Steps, List, Avatar, Modal, message, Input, Form } from 'antd';
import { useEffect, useState } from 'react';
const { Header, Content, Footer } = Layout;
import { auth, db } from '../lib/firebase';
import { collection, query, where, onSnapshot, orderBy, setDoc, doc } from "firebase/firestore";
import {
    LogoutOutlined,
    CrownOutlined,
    FileSearchOutlined,
    LoadingOutlined,
    SettingOutlined,
    FolderOpenOutlined,
    FileUnknownOutlined,
    RightOutlined,
    FolderAddOutlined,
    FileAddOutlined
} from '@ant-design/icons';

const { confirm } = Modal;



export default function Dashboard() {
    const user = null;
    const [app, setApp] = useState('admin');


    const selectSection = (section) => {
        setApp(section);
    }


    const AdminSection = () => {

        const [loading, setLoading] = useState(true);
        const [assignments, setAssignments] = useState([]);
        const [questions, setQuestions] = useState([]);
        const [assignment, setAssignment] = useState('Select Assignment');
        const [question, setQuestion] = useState('Select Question');
        const [questionData, setQuestionData] = useState({});

        const [curentStep, setCurrentStep] = useState(0);

        useEffect(() => {

            const q = query(collection(db, "assignments"), orderBy("name", "asc"));
            const unsubscribe = onSnapshot(q, (querySnapshot) => {
                const items = [];
                querySnapshot.forEach((doc) => {
                    items.push({ id: doc.id, ...doc.data()});
                });
                setAssignments(items);
                setLoading(false);
            });


            return () => unsubscribe();
        }, []);

        useEffect(() => {
            if (assignment !== 'Select Assignment') {
                setCurrentStep(1);
                var questions = [];
                const q = query(collection(db, "assignments", assignment, "questions"), orderBy("name", "asc"));
                const unsubscribe = onSnapshot(q, (querySnapshot) => {
                    const items = [];
                    querySnapshot.forEach((doc) => {
                        items.push({ id: doc.id, ...doc.data() });
                    });
                    setQuestions(items);
                });
                setQuestions(questions);

                return () => unsubscribe();
            }
        }, [assignment]);

        useEffect(() => {
            if (question !== 'Select Question') {
                setCurrentStep(2);
                questions.forEach((item) => {
                    if (item.name === question) {
                        setQuestionData(item);
                    }
                });
            }
        }, [question]);



        const addAssignment = () => {
            var assignmentName = '';
            confirm({
                title: 'Add Assignment',
                icon: <FolderAddOutlined />,
                content: <>
                    <Input placeholder="Assignment Name" onChange={(e) => { assignmentName = e.target.value }} />
                </>,
                okType: 'default',
                onOk: async (e) => {
                    if (assignmentName === '') {
                        message.error('Please Enter Assignment Name');
                        return;
                    }
                    message.loading({ content: 'Adding Assignment...', key: 'add-assignment' });
                    await setDoc(doc(db, "assignments", assignmentName), {
                        name: assignmentName,
                        questions: []
                    });
                    message.success({ content: 'Assignment Added', key: 'add-assignment' });
                },
                onCancel() {
                    console.log('Cancel');
                },
            });
        }

        const addQuestion = () => {
            var questionName = '';
            confirm({
                title: 'Add Question',
                icon: <FileAddOutlined />,
                content: <>
                    <Input placeholder="Question Name" onChange={(e) => { questionName = e.target.value }} />
                </>,
                okType: 'default',
                onOk: async (e) => {
                    if (questionName === '') {
                        message.error('Please Enter Question Name');
                        return;
                    }
                    message.loading({ content: 'Adding Question...', key: 'add-question' });
                    await setDoc(doc(db, "assignments", assignment, "questions", questionName), {
                        name: questionName,
                        files: []
                    });
                    message.success({ content: 'Question Added', key: 'add-question' });
                },
                onCancel() {
                    console.log('Cancel');
                },
            });
        }




        return (
            <div className="w-full h-full flex justify-center items-center">
                <Card title={
                    <Steps current={curentStep} type="navigation" className="mt-5" onChange={(e) => {
                        if (e < curentStep) {
                            if (e === 0) {
                                setAssignment('Select Assignment');
                                setQuestion('Select Question');
                            } else if (e === 1) {
                                setQuestion('Select Question');
                            }
                            setCurrentStep(e)
                        }
                    }}>
                        <Steps.Step title="Assignments" description={assignment} icon={loading ? <LoadingOutlined spin /> : <FolderOpenOutlined />} />
                        <Steps.Step title="Questions" description={question} icon={loading ? <LoadingOutlined spin /> : <FileUnknownOutlined />} />
                        <Steps.Step title="Configure" description={question} icon={loading ? <LoadingOutlined spin /> : <SettingOutlined />} />
                    </Steps>
                } className="w-11/12 h-full mt-8 shadow-lg">

                    <div className="flex justify-between items-start w-full h-full">


                        <div className="w-1/3 h-full mx-2">
                            <List
                                header={<div className="font-bold text-xl flex justify-between">
                                    <span>Assignments</span>
                                    <Button type="link" icon={<FolderAddOutlined />} onClick={() => addAssignment()}></Button>
                                </div>}
                                bordered
                                dataSource={assignments}
                                renderItem={item => (
                                    <List.Item key={item.name} className={assignment == item?.name && 'bg-blue-50'} extra={<Button type="link" icon={<RightOutlined />} disabled={assignment == item?.name} ></Button>} onClick={() => {
                                        setAssignment(item.name);
                                    }}>
                                        <List.Item.Meta
                                            avatar={<Avatar style={{ backgroundColor: "indigo" }} icon={<FolderOpenOutlined />} />}
                                            title={<p className="font-bold text-lg">{item.name}</p>}
                                        />
                                    </List.Item>
                                )}
                            />
                        </div>


                        <div className="w-1/3 h-full mx-2">
                            <List
                                header={<div className="font-bold text-xl flex justify-between">
                                    <span>Questions</span>
                                    {assignment !== 'Select Assignment' && <Button type="link" icon={<FileAddOutlined />} onClick={() => addQuestion()}></Button>}
                                </div>}
                                bordered
                                dataSource={questions}
                                renderItem={(item, index) => (
                                    <List.Item key={index} className={question == item?.name && 'bg-blue-50'} extra={<Button type="link" icon={<RightOutlined />} disabled={question == item?.name} ></Button>} onClick={() => {
                                        setQuestion(item.name);
                                        setCurrentStep(3);
                                    }}>
                                        <List.Item.Meta
                                            avatar={<Avatar style={{ backgroundColor: "coral" }} icon={<FileUnknownOutlined />} />}
                                            title={<p className="font-bold text-lg">{item?.name}</p>}
                                        />
                                    </List.Item>
                                )}
                            />
                        </div>



                        <div className="w-1/3 h-full mx-2">
                            <List
                                header={<div className="font-bold text-xl">Configure</div>}
                                bordered
                            >
                                {question !== 'Select Question' &&
                                    <Form layout="vertical" className="w-11/12 mx-2 mt-5">
                                        <Form.Item label={<span className="font-bold">Name</span>} required>
                                            <Input value={questionData?.name} onChange={(e) => { setQuestionData({ ...questionData, name: e.target.value }) }} required />
                                        </Form.Item>
                                        <Form.Item label={<span className="font-bold">Question</span>}>
                                            <Input.TextArea value={questionData?.question} onChange={(e) => { setQuestionData({ ...questionData, question: e.target.value }) }} />
                                        </Form.Item>
                                        <Form.Item label={<span className="font-bold">Answer</span>}>
                                            <Input.TextArea value={questionData?.description} onChange={(e) => { setQuestionData({ ...questionData, description: e.target.value }) }} />
                                        </Form.Item>
                                        <Form.Item label={<span className="font-bold">Level</span>}>
                                            <Input value={questionData?.level} onChange={(e) => { setQuestionData({ ...questionData, level: e.target.value }) }} />
                                        </Form.Item>
                                        <Form.Item label={<span className="font-bold">Grade</span>}>
                                            <Input type='number' value={questionData?.grade} onChange={(e) => { setQuestionData({ ...questionData, grade: e.target.value }) }} />
                                        </Form.Item>
                                        <Form.Item>
                                            <Button type="primary" className="w-full bg-blue-600" onClick={() => {
                                                confirm({
                                                    title: 'Are you sure?',
                                                    icon: <SettingOutlined />,
                                                    content: 'Do you want to update the question?',
                                                    okType: 'default',
                                                    onOk: async (e) => {
                                                        message.loading({ content: 'Updating Question...', key: 'update-question' });
                                                        // get id of question and assignment
                                                        let assignmentId = '';
                                                        let questionId = '';
                                                        assignments.forEach((item) => {
                                                            if (item.name === assignment) {
                                                                assignmentId = item.id;
                                                            }
                                                        });
                                                        questions.forEach((item) => {
                                                            if (item.name === question) {
                                                                questionId = item.id;
                                                            }
                                                        });
                                                        console.log(assignmentId, questionId);

                                                        await setDoc(doc(db, "assignments", assignmentId, "questions", questionId), {
                                                            name: questionData?.question || "",
                                                            question: questionData?.question || "",
                                                            description: questionData?.description || "",
                                                            level: questionData?.level || "",
                                                            grade: questionData?.grade || 0
                                                        });
                                                        message.success({ content: 'Question Updated', key: 'update-question' });
                                                    },
                                                    onCancel() {
                                                        console.log('Cancel');
                                                    },
                                                });
                                            }}>Update</Button>
                                        </Form.Item>
                                    </Form>
                                }

                            </List>
                        </div>
                    </div>


                </Card>
            </div>
        )
    }

    const GradingSection = () => {
        return (
            <div className="flex justify-center items-center w-full h-full">
                <Card title={
                    <Steps current={1} className="mt-5">
                        <Steps.Step title="Assignments" description="Login to the app" />
                        <Steps.Step title="Upload" description="Upload the files" />
                        <Steps.Step title="Grading" description="Grading the files" />
                    </Steps>
                } className="w-11/12 h-full mt-8 shadow-lg">

                </Card>
            </div>
        )
    }



    return (
        <Layout className="w-full h-screen">
            <Header className="flex justify-between items-center">
                <div className="logo w-">
                    <h2 className="text-white font-bold text-2xl mt-4 mr-16">Grading Portal</h2>
                </div>
                <Menu theme="dark" mode="horizontal" className='w-1/2' selectedKeys={app} onSelect={(e) => selectSection(e.key)}>
                    <Menu.Item key="admin"><CrownOutlined /> Admin Section</Menu.Item>
                    <Menu.Item key="grading"> <FileSearchOutlined /> Grading Portal</Menu.Item>
                </Menu>
                <Button onClick={() => auth.signOut()} danger className="mr-4" icon={<LogoutOutlined />}>Logout</Button>
            </Header>
            <Content className="flex justify-center items-center">
                {app === 'admin' ? <AdminSection /> : app === 'grading' ? <GradingSection /> : <Spin size='large' />}

            </Content>
            <Footer style={{ textAlign: 'center' }}>AI Grading App, Project By Poojitha</Footer>
        </Layout>
    )
}