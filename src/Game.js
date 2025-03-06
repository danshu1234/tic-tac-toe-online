import { useEffect, useState } from 'react';
import './App.css'

const Game = (props) => {
    const [itemsArr, setItemsArr] = useState([]);
    const [count, setCount] = useState(0);
    const [over, setOver] = useState(false);
    const [warn, setWarn] = useState('');

    const exitGame = () => {
        localStorage.removeItem('you');
        localStorage.removeItem('friendSocket');
        props.setShow('menu');
    };

    useEffect(() => {
        let arr = [];
        for (let i = 0; i < 9; i++) {
            arr.push(i);
        }
        const resultArr = arr.map(item => {
            return {
                id: item,
                pos: '',
            };
        });
        setItemsArr(resultArr);
    }, []);

    useEffect(() => {
        if (localStorage.getItem('you') === null) {
            setOver(true);
        }
    }, []);

    useEffect(() => {
        props.conSocket.on('update', ({ jsonArr }) => {
            const newArr = JSON.parse(jsonArr);
            setItemsArr(newArr);
            setOver(false);
        });
        props.conSocket.on('exit', () => {
            setOver(true);
            setWarn('Пользователь покинул матч');
            setTimeout(() => {
                exitGame();
            }, 2000);
        });
    }, []);

    useEffect(() => {
        window.addEventListener('beforeunload', () => {
            const friendSocket = localStorage.getItem('friendSocket');
            props.conSocket.emit('exitGame', { friendSocket: friendSocket });
            exitGame();
        });
    }, []);

    useEffect(() => {
        setCount(count + 1);
        if (count > 5) {
            if (itemsArr[0].pos === itemsArr[1].pos && itemsArr[1].pos === itemsArr[2].pos) {
                if (itemsArr[0].pos === 'X') {
                    setWarn('Победили крестики!');
                } else {
                    setWarn('Победили нулики!');
                }
                setOver(true);
                setTimeout(() => {
                    exitGame();
                }, 2000);
            }
            if (itemsArr[3].pos === itemsArr[4].pos && itemsArr[4].pos === itemsArr[5].pos) {
                if (itemsArr[0].pos === 'X') {
                    setWarn('Победили крестики!');
                } else {
                    setWarn('Победили нулики!');
                }
                setOver(true);
                setTimeout(() => {
                    exitGame();
                }, 2000);
            }
            if (itemsArr[6].pos === itemsArr[7].pos && itemsArr[7].pos === itemsArr[8].pos) {
                if (itemsArr[0].pos === 'X') {
                    setWarn('Победили крестики!');
                } else {
                    setWarn('Победили нулики!');
                }
                setOver(true);
                setTimeout(() => {
                    exitGame();
                }, 2000);
            }
            if (itemsArr[0].pos === itemsArr[3].pos && itemsArr[3].pos === itemsArr[6].pos) {
                if (itemsArr[0].pos === 'X') {
                    setWarn('Победили крестики!');
                } else {
                    setWarn('Победили нулики!');
                }
                setOver(true);
                setTimeout(() => {
                    exitGame();
                }, 2000);
            }
            if (itemsArr[1].pos === itemsArr[4].pos && itemsArr[4].pos === itemsArr[7].pos) {
                if (itemsArr[0].pos === 'X') {
                    setWarn('Победили крестики!');
                } else {
                    setWarn('Победили нулики!');
                }
                setOver(true);
                setTimeout(() => {
                    exitGame();
                }, 2000);
            }
            if (itemsArr[2].pos === itemsArr[5].pos && itemsArr[5].pos === itemsArr[8].pos) {
                if (itemsArr[0].pos === 'X') {
                    setWarn('Победили крестики!');
                } else {
                    setWarn('Победили нулики!');
                }
                setOver(true);
                setTimeout(() => {
                    exitGame();
                }, 2000);
            }
            if (itemsArr[0].pos === itemsArr[4].pos && itemsArr[4].pos === itemsArr[8].pos) {
                if (itemsArr[0].pos === 'X') {
                    setWarn('Победили крестики!');
                } else {
                    setWarn('Победили нулики!');
                }
                setOver(true);
                setTimeout(() => {
                    exitGame();
                }, 2000);
            }
            if (itemsArr[2].pos === itemsArr[4].pos && itemsArr[4].pos === itemsArr[6].pos) {
                if (itemsArr[0].pos === 'X') {
                    setWarn('Победили крестики!');
                } else {
                    setWarn('Победили нулики!');
                }
                setOver(true);
                setTimeout(() => {
                    exitGame();
                }, 2000);
            }
            if (itemsArr.every(item => item.pos !== '') === true) {
                setWarn('Ничья');
                setOver(true);
                setTimeout(() => {
                    exitGame();
                }, 2000);
            }
        }
    }, [itemsArr]);

    return (
        <div className="game-container">
            <div className="game-board">
                {itemsArr.map((item, index) => {
                    if (item.pos === '') {
                        return (
                            <div
                                key={index}
                                className="game-cell"
                                onClick={() => {
                                    if (over === false) {
                                        const newArr = itemsArr.map(el => {
                                            if (item.id === el.id) {
                                                if (count % 2 === 1) {
                                                    return {
                                                        id: el.id,
                                                        pos: 'X',
                                                    };
                                                } else {
                                                    return {
                                                        id: el.id,
                                                        pos: 'O',
                                                    };
                                                }
                                            } else {
                                                return el;
                                            }
                                        });
                                        setItemsArr(newArr);
                                        setOver(true);
                                        const friendSocket = localStorage.getItem('friendSocket');
                                        const jsonArr = JSON.stringify(newArr);
                                        props.conSocket.emit('updateGame', { friendSocket: friendSocket, jsonArr });
                                    }
                                }}
                            ></div>
                        );
                    } else if (item.pos === 'X') {
                        return (
                            <div key={index} className="game-cell">
                                <p>X</p>
                            </div>
                        );
                    } else {
                        return (
                            <div key={index} className="game-cell">
                                <p>O</p>
                            </div>
                        );
                    }
                })}
            </div>
            <h2 className="warning">{warn}</h2>
        </div>
    );
};

export default Game;