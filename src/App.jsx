import {useCallback, useEffect, useState} from 'react';
import {useTelegram} from "./hooks/useTelegram.js";
import './App.css'

const App = () => {
    const [phoneNumber, setPhoneNumber] = useState('');
    const [fullName, setFullName] = useState('');
    const [birthDate, setBirthDate] = useState('');
    const [address, setAddress] = useState('');

    const [phoneNumberValid, setPhoneNumberValid] = useState(false);
    const [fullNameValid, setFullNameValid] = useState(false);
    const [birthDateValid, setBirthDateValid] = useState(false);
    const [addressValid, setAddressValid] = useState(false);

    const {tg, first_nameTg, last_nameTg, userId, queryId} = useTelegram();

    // Отправляем данные на сервер
    const onSendData = useCallback(() => {
        const data = {
            phoneNumber,
            fullName,
            birthDate,
            address,
            first_nameTg,
            last_nameTg,
            queryId,
            userId
        };
        fetch('https://80.78.243.142/web-data', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data)
        });
        tg.sendData(JSON.stringify(data));
    }, [phoneNumber, fullName, birthDate, address, first_nameTg, last_nameTg, queryId, userId]);

    useEffect(() => {
        tg.onEvent('mainButtonClicked', onSendData);
        return () => {
            tg.offEvent('mainButtonClicked', onSendData);
        };
    }, [onSendData]);

    useEffect(() => {
        tg.MainButton.setParams({
            text: 'Отправить данные'
        });
    }, []);

    // Функция для проверки всех полей
    const checkFormValidity = useCallback(() => {
        if (phoneNumberValid && fullNameValid && birthDateValid && addressValid) {
            tg.MainButton.show();
        } else {
            tg.MainButton.hide();
        }
    }, [phoneNumberValid, fullNameValid, birthDateValid, addressValid, tg.MainButton]);

    // Проверка номера телефона
    const handlePhoneNumberChange = (e) => {
        let input = e.target.value;

        // Проверяем, чтобы длина строки была не больше 12 символов
        if (input.length > 12) {
            input = input.slice(0, 12); // Обрезаем лишние символы
        }

        if (input.startsWith('+7') && /^\+7\d{0,10}$/.test(input)) {
            setPhoneNumber(input);
            setPhoneNumberValid(input.length === 12); // Длина номера должна быть ровно 12 символов
        } else {
            setPhoneNumber(input);
            setPhoneNumberValid(false);
        }
    };

    // Проверка ФИО (Имя Фамилия Отчество)
    const handleFullNameChange = (e) => {
        const input = e.target.value;

        setFullNameValid(true);
        setFullName(input);


    };

    // Проверка даты рождения (формат YYYY-MM-DD)
    const handleBirthDateChange = (e) => {
        const input = e.target.value;
        const birthDateRegex = /^\d{4}-\d{2}-\d{2}$/; // Проверка на формат даты
        if (birthDateRegex.test(input)) {
            setBirthDate(input);
            setBirthDateValid(true);
        } else {
            setBirthDate(input);
            setBirthDateValid(false);
        }
    };

    // Проверка адреса (пример: улица, дом, квартира)
    const handleAddressChange = (e) => {
        const input = e.target.value;
        const addressRegex = /^[А-ЯЁа-яёA-Za-z0-9\s,.-]+$/; // Простой паттерн для улицы и дома
        if (addressRegex.test(input)) {
            setAddress(input);
            setAddressValid(true);
        } else {
            setAddress(input);
            setAddressValid(false);
        }
    };

    useEffect(() => {
        checkFormValidity();
    }, [phoneNumberValid, fullNameValid, birthDateValid, addressValid, checkFormValidity]);

    const getInputClass = (isValid) => {
        return isValid
            ? 'border-green-500 focus:border-green-500'
            : 'border-red-500 focus:border-red-500';
    };

    return (
        <div className="flex flex-col items-start justify-start pt-10 px-4 space-y-4 max-w-md mx-auto">
            <div className='font-bold text-center text-lg'>После заполнения данных, кнопка для отправки появится
                автоматически.
            </div>
            <label className="text-left w-full">
                Введите ваше ФИО
                <div className="relative">
                    <div className="absolute inset-y-0 left-3 my-auto h-6 flex items-center border-r pr-2">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5}
                             stroke="currentColor" className="size-6">
                            <path strokeLinecap="round" strokeLinejoin="round"
                                  d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z"/>
                        </svg>
                    </div>
                    <input
                        type="text"
                        placeholder="Иванов Иван Иванович"
                        value={fullName}
                        onChange={handleFullNameChange}
                        className={`w-full pl-[4.5rem] pr-3 py-2 appearance-none bg-transparent outline-none border shadow-sm rounded-lg ${getInputClass(fullNameValid)}`}
                    />
                </div>
            </label>

            <label className="text-left w-full">
                Введите дату рождения
                <div className="relative">
                    <div className="absolute inset-y-0 left-3 my-auto h-6 flex items-center border-r pr-2">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5}
                             stroke="currentColor" className="size-6">
                            <path strokeLinecap="round" strokeLinejoin="round"
                                  d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 0 1 2.25-2.25h13.5A2.25 2.25 0 0 1 21 7.5v11.25m-18 0A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75m-18 0v-7.5A2.25 2.25 0 0 1 5.25 9h13.5A2.25 2.25 0 0 1 21 11.25v7.5m-9-6h.008v.008H12v-.008ZM12 15h.008v.008H12V15Zm0 2.25h.008v.008H12v-.008ZM9.75 15h.008v.008H9.75V15Zm0 2.25h.008v.008H9.75v-.008ZM7.5 15h.008v.008H7.5V15Zm0 2.25h.008v.008H7.5v-.008Zm6.75-4.5h.008v.008h-.008v-.008Zm0 2.25h.008v.008h-.008V15Zm0 2.25h.008v.008h-.008v-.008Zm2.25-4.5h.008v.008H16.5v-.008Zm0 2.25h.008v.008H16.5V15Z"/>
                        </svg>
                    </div>
                    <input
                        type="date"
                        placeholder="12.12.1980"
                        value={birthDate}
                        onChange={handleBirthDateChange}
                        className={`w-full pl-[4.5rem] pr-3 py-2 appearance-none bg-transparent outline-none border shadow-sm rounded-lg ${getInputClass(birthDateValid)}`}
                    />
                </div>
            </label>

            <label className="text-left w-full">
                Введите адрес проживания
                <div className="relative">
                    <div className="absolute inset-y-0 left-3 my-auto h-6 flex items-center border-r pr-2">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5}
                             stroke="currentColor" className="size-6">
                            <path strokeLinecap="round" strokeLinejoin="round"
                                  d="m2.25 12 8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25"/>
                        </svg>
                    </div>
                    <input
                        type="text"
                        placeholder="ул. Пушкина, д. 10"
                        value={address}
                        onChange={handleAddressChange}
                        className={`w-full pl-[4.5rem] pr-3 py-2 appearance-none bg-transparent outline-none border shadow-sm rounded-lg ${getInputClass(addressValid)}`}
                    />
                </div>
            </label>

            <label className="text-left w-full">
                Введите ваш номер телефона
                <div className="relative">
                    <div className="absolute inset-y-0 left-3 my-auto h-6 flex items-center border-r pr-2">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5}
                             stroke="currentColor" className="w-6 h-6">
                            <path strokeLinecap="round" strokeLinejoin="round"
                                  d="M10.5 1.5H8.25A2.25 2.25 0 0 0 6 3.75v16.5a2.25 2.25 0 0 0 2.25 2.25h7.5A2.25 2.25 0 0 0 18 20.25V3.75a2.25 2.25 0 0 0-2.25-2.25H13.5m-3 0V3h3V1.5m-3 0h3m-3 18.75h3"/>
                        </svg>
                    </div>
                    <input
                        type="text"
                        placeholder="+79999999999"
                        value={phoneNumber}
                        onChange={handlePhoneNumberChange}
                        className={`w-full pl-[4.5rem] pr-3 py-2 appearance-none bg-transparent outline-none border shadow-sm rounded-lg ${getInputClass(phoneNumberValid)}`}
                    />
                </div>
            </label>
        </div>
    );
};

export default App;
