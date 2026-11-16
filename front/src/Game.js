import { useEffect, useState } from 'react';
import './App.css'

const Game = (props) => {
    const [winFigure, setWinFigure] = useState ('')
    const [userFigure, setUserFigure] = useState ('')
    const [itemsArr, setItemsArr] = useState([]);
    const [count, setCount] = useState(0);
    const [over, setOver] = useState(false);
    const [warn, setWarn] = useState('');
    let winShow;

    if (winFigure !== '') {
        if (winFigure === userFigure) {
            winShow = <p style={{color: 'green'}}>Вы победили!</p>
        } else {
            winShow = <p style={{color: 'red'}}>Вы проиграли</p>
        }
    }

    const exitGame = () => {
        localStorage.removeItem('you');
        localStorage.removeItem('friendSocket');
        props.setShow('menu');
    };

    const technicalResult = (win, lose) => {
        const statistic = localStorage.getItem('statistic')
        let userStatistic = ''
        if (statistic) {
            const resultStatistic = JSON.parse(statistic)
            userStatistic = {
                win: resultStatistic.win + win,
                lose: resultStatistic.lose + lose,
            }
        } else {
            userStatistic = {
                win: win,
                lose: lose,
            }
        }
        localStorage.setItem('statistic', JSON.stringify(userStatistic))
    }

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
        if (winFigure !== '') {
            const statistic = localStorage.getItem('statistic')
            let resultStatistic = ''
            if (statistic) {
                const statisticUser = JSON.parse(statistic)
                if (winFigure === userFigure) {
                    resultStatistic = {
                        win: statisticUser.win + 1,
                        lose: statisticUser.lose,
                    }
                } else {
                    resultStatistic = {
                        win: statisticUser.win,
                        lose: statisticUser.lose + 1,
                    }
                }
            } else {
                if (winFigure === userFigure) {
                    resultStatistic = {
                        win: 1,
                        lose: 0,
                    }
                } else {
                    resultStatistic = {
                        win: 0,
                        lose: 1,
                    }
                }
            }
            localStorage.setItem('statistic', JSON.stringify(resultStatistic))
        }
    }, [winFigure])

    useEffect(() => {
        if (localStorage.getItem('you') === null) {
            setOver(true);
            setUserFigure('X')
        } else {
            setUserFigure('0')
        }
    }, []);

    useEffect(() => {
        props.conSocket.on('update', ({ jsonArr }) => {
            const newArr = JSON.parse(jsonArr);
            setItemsArr(newArr);
            setOver(false);
        });
        props.conSocket.on('exit', () => {
            technicalResult(1, 0)
            setOver(true);
            setWarn('Пользователь покинул матч');
            setTimeout(() => {
                exitGame();
            }, 2000);
        });
    }, []);

    useEffect(() => {
        const handleBeforeUnload = () => {
            technicalResult(0, 1);
            const friendSocket = localStorage.getItem('friendSocket');
            props.conSocket.emit('exitGame', { friendSocket: friendSocket });
            exitGame();
        };

        window.addEventListener('beforeunload', handleBeforeUnload);

        return () => {
            window.removeEventListener('beforeunload', handleBeforeUnload);
        };
    }, []);

    useEffect(() => {
        setCount(count + 1);
        if (count > 5) {
            if (itemsArr[0].pos === itemsArr[1].pos && itemsArr[1].pos === itemsArr[2].pos) {
                if (itemsArr[0].pos !== '') {
                    if (itemsArr[0].pos === 'X') {
                        setWarn('Победили крестики!');
                        setWinFigure('X')
                    } else {
                        setWarn('Победили нулики!');
                        setWinFigure('0')
                    }
                    setOver(true);
                    setTimeout(() => {
                        exitGame();
                    }, 2000);
                }
            }
            if (itemsArr[3].pos === itemsArr[4].pos && itemsArr[4].pos === itemsArr[5].pos) {
                if (itemsArr[3].pos !== '') {
                    if (itemsArr[3].pos === 'X') {
                        setWarn('Победили крестики!');
                        setWinFigure('X')
                    } else {
                        setWarn('Победили нулики!');
                        setWinFigure('0')
                    }
                    setOver(true);
                    setTimeout(() => {
                        exitGame();
                    }, 2000);
                }
            }
            if (itemsArr[6].pos === itemsArr[7].pos && itemsArr[7].pos === itemsArr[8].pos) {
                if (itemsArr[6].pos !== '') {
                    if (itemsArr[6].pos === 'X') {
                        setWarn('Победили крестики!');
                        setWinFigure('X')
                    } else {
                        setWarn('Победили нулики!');
                        setWinFigure('0')
                    }
                    setOver(true);
                    setTimeout(() => {
                        exitGame();
                    }, 2000);
                }
            }
            if (itemsArr[0].pos === itemsArr[3].pos && itemsArr[3].pos === itemsArr[6].pos) {
                if (itemsArr[0].pos !== '') {
                    if (itemsArr[0].pos === 'X') {
                        setWarn('Победили крестики!');
                        setWinFigure('X')
                    } else {
                        setWarn('Победили нулики!');
                        setWinFigure('0')
                    }
                    setOver(true);
                    setTimeout(() => {
                        exitGame();
                    }, 2000);
                }
            }
            if (itemsArr[1].pos === itemsArr[4].pos && itemsArr[4].pos === itemsArr[7].pos) {
                if (itemsArr[1].pos !== '') {
                    if (itemsArr[1].pos === 'X') {
                        setWarn('Победили крестики!');
                        setWinFigure('X')
                    } else {
                        setWarn('Победили нулики!');
                        setWinFigure('0')
                    }
                    setOver(true);
                    setTimeout(() => {
                        exitGame();
                    }, 2000);
                }
            }
            if (itemsArr[2].pos === itemsArr[5].pos && itemsArr[5].pos === itemsArr[8].pos) {
                if (itemsArr[2].pos !== '') {
                    if (itemsArr[2].pos === 'X') {
                        setWarn('Победили крестики!');
                        setWinFigure('X')
                    } else {
                        setWarn('Победили нулики!');
                        setWinFigure('0')
                    }
                    setOver(true);
                    setTimeout(() => {
                        exitGame();
                    }, 2000);
                }
            }
            if (itemsArr[0].pos === itemsArr[4].pos && itemsArr[4].pos === itemsArr[8].pos) {
                if (itemsArr[0].pos !== '') {
                    if (itemsArr[0].pos === 'X') {
                        setWarn('Победили крестики!');
                        setWinFigure('X')
                    } else {
                        setWarn('Победили нулики!');
                        setWinFigure('0')
                    }
                    setOver(true);
                    setTimeout(() => {
                        exitGame();
                    }, 2000);
                }
            }
            if (itemsArr[2].pos === itemsArr[4].pos && itemsArr[4].pos === itemsArr[6].pos) {
                if (itemsArr[2].pos !== '') {
                    if (itemsArr[2].pos === 'X') {
                        setWarn('Победили крестики!');
                        setWinFigure('X')
                    } else {
                        setWarn('Победили нулики!');
                        setWinFigure('0')
                    }
                    setOver(true);
                    setTimeout(() => {
                        exitGame();
                    }, 2000);
                }
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
            {winShow}
            {over === false ? <h2 style={{color: 'green'}}>Ваш ход</h2> : <h2 style={{color: 'red'}}>Ход соперника</h2>}
        </div>
    );
};

export default Game;