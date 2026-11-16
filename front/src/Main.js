import { useEffect, useState } from 'react';
import { io } from "socket.io-client";
import Game from './Game';
import './App.css'
import Statistic from './Statistic';

const Main = () => {
    const socketCon = io("http://localhost:4444");

    const [isStatistic, setIsStatistic] = useState (false)
    const [copyStatus, setCopyStatus] = useState (false)    
    const [conSocket, setConSocket] = useState('');
    const [socketInput, setSocketInput] = useState('');
    const [inviteCode, setInviteCode] = useState('');
    const [lastFriend, setLastFriend] = useState('');
    const [show, setShow] = useState('menu');
    const [warn, setWarn] = useState('');
    let inter;
    let last;
    let yourCode;

    const ifCheckedSocketTrue = async () => {
        const checkBusyUser = await fetch('http://localhost:4444/check/busy', {
            method: "POST",
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ socketInput })
        });
        const response = await checkBusyUser.json();
        if (response.response === 'OK') {
            const friendSocket = localStorage.getItem('currentSocket');
            if (friendSocket !== socketCon.id) {
                const myInviteCode = socketCon.id;
                const request = await fetch('http://localhost:4444/add/busy/user', {
                    method: "POST",
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ myInviteCode })
                });
                await request.json();
                localStorage.setItem('friendSocket', friendSocket);
                localStorage.setItem('you', 'true');
                socketCon.emit('inviteGame', { socketInput: friendSocket, socketId: myInviteCode });
                setLastFriend(friendSocket);
                setShow('game');
            } else {
                setWarn('Вы не можете играть с самим собой');
            }
        } else {
            setWarn('Этот пользователь сейчас занят');
        }
    };

    useEffect(() => {
        const deleteUserFromBusyList = async () => {
            if (show === 'menu') {
                const busySocket = conSocket.id;
                try {
                    const deleteThisUserFromBusyList = await fetch('http://localhost:4444/delete/busy', {
                        method: "POST",
                        headers: {
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify({ busySocket })
                    });
                    const result = await deleteThisUserFromBusyList.json();
                    console.log(result.response);
                } catch (error) {
                    console.error('Ошибка при удалении из списка занятых:', error);
                }
            }
        };

        deleteUserFromBusyList();
    }, [show, conSocket.id]);

    useEffect(() => {
        if (copyStatus === true) {
            setTimeout(() => {
                setCopyStatus(false)
            }, 1500);
        }
    }, [copyStatus])

    if (show === 'menu') {
        yourCode = (
            <div className="code-container">
                <h2>Ваш код для приглашения: {inviteCode}</h2>
                {copyStatus === false ? <button onClick={async() => {
                    await navigator.clipboard.writeText(inviteCode)
                    setCopyStatus(true)
                }}>Скопировать</button> : <p style={{color: 'green'}}>socket.id скопирован</p>}
            </div>
        );
    }

    if (lastFriend !== '') {
        last = (
            <div className="code-container">
                <h2>Id вашего последнего соперника: {lastFriend}</h2>
            </div>
        );
    }

    useEffect(() => {
        if (warn !== '') {
            setTimeout(() => {
                setWarn('');
            }, 2000);
        }
    }, [warn]);

    useEffect(() => {
        const storageStatistic = localStorage.getItem('statistic')
        if (storageStatistic) {
            setIsStatistic(true)
        } else {
            setIsStatistic(false)
        }
    }, [])

    useEffect(() => {
        localStorage.setItem('currentSocket', socketInput);
    }, [socketInput]);

    useEffect(() => {
        socketCon.on('connect', () => {
            setInviteCode(socketCon.id);
            setConSocket(socketCon);
        });

        socketCon.on('invite', async ({ socketId }) => {
            const myInviteCode = socketCon.id;
            const request = await fetch('http://localhost:4444/add/busy/user', {
                method: "POST",
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ myInviteCode })
            });
            await request.json();
            localStorage.setItem('friendSocket', socketId);
            setLastFriend(socketId);
            setShow('game');
        });

        socketCon.on('closeApp', ({ socketConId }) => {
            setLastFriend(prev => {
                if (prev === socketConId) {
                    return '';
                } else {
                    return prev;
                }
            });
        });

        socketCon.on('resultCheck', ({ message }) => {
            if (message === 'OK') {
                ifCheckedSocketTrue();
            } else {
                setWarn('Такого пользователя не существует');
            }
        });

        window.addEventListener('beforeunload', () => {
            const socketConId = socketCon.id;
            socketCon.emit('exitApp', { socketConId: socketConId });
        });
    }, []);

    if (show === 'menu') {
        inter = (
            <div className="input-container">
                <input
                    placeholder="socket.id вашего друга"
                    onChange={(event) => setSocketInput(event.target.value)}
                />
                <button
                    onClick={async () => {
                        const mySocket = inviteCode;
                        socketCon.emit('checkSocket', { mySocket: mySocket, checkSocket: socketInput });
                    }}
                >
                    Играть
                </button>
                {yourCode}
                {last}
                {isStatistic ? <p onClick={() => setShow('statistic')}>Моя статистика</p> : null}
            </div>
        );
    } else if (show === 'game') {
        if (conSocket !== '') {
            inter = <Game conSocket={conSocket} setShow={setShow} />;
        }
    } else {
        inter = <Statistic setShow={setShow}/>
    }

    return (
        <div className="main-container">
            {inter}
            <h2 className="warning">{warn}</h2>
        </div>
    );
};

export default Main;