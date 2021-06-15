import { html, render } from 'https://unpkg.com/lit-html?module';

let accCardsList = document.getElementsByClassName('accounts-list')[0];
let trCardsList = document.getElementsByClassName('transactions-list')[0];
let playerCashAmount = document.getElementsByClassName('wrapper-left-footer')[0];

// raw data (this is hardcoded data which is used just for tests. Replace this data with data from the database) *******

let playerName = 'Георги Иванов';
let playerCash = '10231';
let allAccounts = [{ accName: 'Лична сметка', accNumber: '68859361', accHolder: 'Георги Иванов', accAmount: '4000' }, { accName: 'Кафене на Гроув', accNumber: '98741361', accHolder: 'Георги Иванов', accAmount: '19630' }, { accName: 'Сметка за дарения', accNumber: '31856462', accHolder: 'Георги Иванов', accAmount: '5269' }];
let allTransactions = [{ trAccName: 'Лична сметка', trAccNum: '68859361', trNumber: 'sdebfr-srfgbbs-srwvsvny-216gbd', trAmount: '10526', trType: 'deposit', trSender: 'Георги Иванов', trRecipient: 'Георги Иванов', trDate: '05/06/2020', trTime: '13:54', trReason: 'Депозирам пари намерени на улицата, които със сигурност не са от нелегална дейност' },
{ trAccName: 'Лична сметка', trAccNum: '68859361', trNumber: 'dfgbdf-b6f5bf-xfbff-nhgnhg', trAmount: '3500', trType: 'withdraw', trSender: 'Георги Иванов', trRecipient: 'Георги Иванов', trDate: '04/06/2020', trTime: '18:20', trReason: 'Тегля пари за да си купя флашки с Тони Стораро' },
{ trAccName: 'Лична сметка', trAccNum: '68859361', trNumber: 'yukmyu-ccfgh-sdvsdv-acvdv', trAmount: '2000', trType: 'transfer', trSender: 'Георги Иванов', trRecipient: 'Иван Георгиев', trDate: '03/06/2020', trTime: '09:00', trReason: 'Пращам пари на аверчето да си има' },
{ trAccName: 'Лична сметка', trAccNum: '68859361', trNumber: 'bgbfdn-ccfgh-sdvsdv-acvdv', trAmount: '3526', trType: 'transfer', trSender: 'Иван Георгиев', trRecipient: 'Георги Иванов', trDate: '03/06/2020', trTime: '09:00', trReason: 'Пращам пари на аверчето да си има' }];

// ***************************************************

renderPlayerCash();

for (let i = 0; i < allAccounts.length; i++) {
    createAccountCard(allAccounts[i].accName, allAccounts[i].accNumber, allAccounts[i].accHolder, allAccounts[i].accAmount);
}

for (let i = 0; i < allTransactions.length; i++) {
    createTransactionCard(allTransactions[i].trAccName, allTransactions[i].trAccNum, allTransactions[i].trNumber, allTransactions[i].trAmount, allTransactions[i].trType, allTransactions[i].trSender, allTransactions[i].trRecipient, allTransactions[i].trDate, allTransactions[i].trTime, allTransactions[i].trReason)
}

function createAccountCard(accName, accNumber, accHolder, accAmount) {
    let accCard = () => html`
    <div class="account-card">
        <div class="account-card-header">
            <p>${accName} / ${accNumber}</p>
        </div>
        <div class="account-card-body">
            <p class="account-holder">${accHolder}</p>
            <p class="account-amount">$${accAmount}</p>
        </div>
        <div class="account-card-footer">
            <button class="depositBtn">ДЕПОЗИТ</button>
            <button class="withdrawBtn">ИЗТЕГЛИ</button>
            <button class="transferBtn">ТРАНСФЕР</button>
        </div>
    </div>
    `
    let tempChild = document.createElement('div');
    accCardsList.appendChild(tempChild)
    render(accCard(), accCardsList.lastChild)

    accCardsList.lastChild.getElementsByClassName('depositBtn')[0].addEventListener('click', function () {

        const popUpModal = () => html`
            <div class="modal-contents">
                <div class="close">+</div>
                <div class="bankAccountName">${accName} / ${accNumber}</div>
                <div class="errorMsg"></div>
                <div class="form">
                    <input class="modalAmount" type="number" onkeydown="return event.keyCode !== 69" placeholder="$" />
                    <input class="modalReason" type="text" placeholder="Основание (1-100)" maxlength="100" />
                    <div class="modal-buttons">
                        <button class="modalCancelBtn">ОТКАЗ</button>
                        <button class="modalDepositBtn">ДЕПОЗИРАЙ</button>
                    </div>
                </div>
            </div>
            <label for="check" style="display: none">
                <div class="check-icon"></div>
            </label>
        `
        let tempChild = document.createElement('div');
        tempChild.className = 'bg-modal';
        document.getElementsByClassName('wrapper')[0].appendChild(tempChild)
        render(popUpModal(), document.getElementsByClassName('wrapper')[0].lastChild);

        document.querySelector('.bg-modal').style.display = 'flex';
        document.querySelector('.modalDepositBtn').style.display = "inline-block";

        document.getElementsByClassName('close')[0].addEventListener('click', () => closeModalWindow());
        document.getElementsByClassName('modalCancelBtn')[0].addEventListener('click', () => closeModalWindow());
        document.getElementsByClassName('modalDepositBtn')[0].addEventListener('click', () => submitData());
        document.addEventListener('keydown', function (e) {
            if (e.key === "Escape") {
                closeModalWindow()
            }
        }, { once: true });

        function closeModalWindow() {
            if (document.querySelector('.bg-modal')) {
                document.querySelector('.bg-modal').remove();
            }
        }

        function submitData() {
            let modalAmount = document.getElementsByClassName('modalAmount')[0].value;
            let modalReason = document.getElementsByClassName('modalReason')[0].value;

            if (modalAmount === '' || (Number(playerCash) - Number(modalAmount)) < 0) {
                document.getElementsByClassName('modalAmount')[0].style.borderBottom = "2px solid #ff0000";
                document.querySelector('.errorMsg').style.display = 'block';
                document.querySelector('.errorMsg').textContent = 'Попълнете всички полета';
                if (Number(playerCash) - Number(modalAmount) < 0) {
                    document.querySelector('.errorMsg').textContent = 'Невалидна сума';
                }
            } else {
                document.getElementsByClassName('modalAmount')[0].style.borderBottom = "2px solid #ffffff";
            }

            if (modalReason === '') {
                document.getElementsByClassName('modalReason')[0].style.borderBottom = "2px solid #ff0000";
                document.querySelector('.errorMsg').style.display = 'block';
                document.querySelector('.errorMsg').textContent = 'Попълнете всички полета';
            } else {
                document.getElementsByClassName('modalReason')[0].style.borderBottom = "2px solid #ffffff";
            }

            if (modalAmount !== '' && modalReason !== '' && (Number(playerCash) - Number(modalAmount)) >= 0) {

                // стигне ли до тук, значи всички полета са правилно запълнени и може да се праща заявка с данните (modalAmount и modalReason)
                // if we get here, this means the input values are correct and we can send a query with the data (modalAmount & modalReason)

                document.querySelector('.bankAccountName').remove();
                document.querySelector('.form').remove();
                document.querySelector('.errorMsg').remove();
                document.querySelector('label').style.display = 'inline-block';


                createTransactionCard(accName, accNumber, 'fbth-jkbg-vear-ybyh', modalAmount, 'deposit', playerName, playerName, '07/06/2021', '12:12', modalReason, true)
                playerCash = Number(playerCash) - Number(modalAmount);


                renderPlayerCash();

                //example code (write the query here) ************************

                console.log(modalAmount)
                console.log(modalReason)

                //***************************************

                setTimeout(() => document.querySelector('.bg-modal').remove(), 1000);

                document.querySelectorAll('.account-card').forEach(e => (e.querySelector('.account-card-header').querySelector('p').textContent === accName + ' / ' + accNumber) ?
                    e.querySelector('.account-amount').textContent = '$' + (Number(e.querySelector('.account-amount').textContent.substring(1)) + Number(modalAmount)) : '')
            }
        }
    });

    accCardsList.lastChild.getElementsByClassName('withdrawBtn')[0].addEventListener('click', function () {

        const popUpModal = () => html`
            <div class="modal-contents">
                <div class="close">+</div>
                <div class="bankAccountName">${accName} / ${accNumber}</div>
                <div class="errorMsg"></div>
                <div class="form">
                    <input class="modalAmount" type="number" onkeydown="return event.keyCode !== 69" placeholder="$" />
                    <input class="modalReason" type="text" placeholder="Основание (1-100)" maxlength="100" />
                    <div class="modal-buttons">
                        <button class="modalCancelBtn">ОТКАЗ</button>
                        <button class="modalWithdrawBtn">ИЗТЕГЛИ</button>
                    </div>
                </div>
            </div>
            <label for="check" style="display: none">
                <div class="check-icon"></div>
            </label>
        `
        let tempChild = document.createElement('div');
        tempChild.className = 'bg-modal';
        document.getElementsByClassName('wrapper')[0].appendChild(tempChild)
        render(popUpModal(), document.getElementsByClassName('wrapper')[0].lastChild);

        document.querySelector('.bg-modal').style.display = 'flex';
        document.querySelector('.modalWithdrawBtn').style.display = "inline-block";

        document.getElementsByClassName('close')[0].addEventListener('click', () => closeModalWindow());
        document.getElementsByClassName('modalCancelBtn')[0].addEventListener('click', () => closeModalWindow());
        document.getElementsByClassName('modalWithdrawBtn')[0].addEventListener('click', () => submitData());

        function closeModalWindow() {
            if (document.querySelector('.bg-modal')) {
                document.querySelector('.bg-modal').remove();
            }
        }

        document.addEventListener('keydown', function (e) {
            if (e.key === "Escape") {
                closeModalWindow()
            }
        }, { once: true });

        function submitData() {
            let modalAmount = document.getElementsByClassName('modalAmount')[0].value;
            let modalReason = document.getElementsByClassName('modalReason')[0].value;

            if (modalAmount === '' || Number(accAmount) - Number(modalAmount) < 0) {
                document.getElementsByClassName('modalAmount')[0].style.borderBottom = "2px solid #ff0000";
                document.querySelector('.errorMsg').style.display = 'block';
                document.querySelector('.errorMsg').textContent = 'Попълнете всички полета';
                if (Number(accAmount) - Number(modalAmount) < 0) {
                    document.querySelector('.errorMsg').textContent = 'Невалидна сума';
                }
            } else {
                document.getElementsByClassName('modalAmount')[0].style.borderBottom = "2px solid #ffffff";
            }

            if (modalReason === '') {
                document.getElementsByClassName('modalReason')[0].style.borderBottom = "2px solid #ff0000";
                document.querySelector('.errorMsg').style.display = 'block';
                document.querySelector('.errorMsg').textContent = 'Попълнете всички полета';
            } else {
                document.getElementsByClassName('modalReason')[0].style.borderBottom = "2px solid #ffffff";
            }

            if (modalAmount !== '' && modalReason !== '' && Number(accAmount) - Number(modalAmount) >= 0) {

                // стигне ли до тук, значи всички полета са правилно запълнени и може да се праща заявка с данните (modalAmount и modalReason)
                // if we get here, this means the input values are correct and we can send a query with the data (modalAmount & modalReason)

                document.querySelector('.bankAccountName').remove();
                document.querySelector('.form').remove();
                document.querySelector('.errorMsg').remove();
                document.querySelector('label').style.display = 'inline-block';

                //example code (write the query here) ************************

                createTransactionCard(accName, accNumber, 'fbth-jkbg-vear-ybyh', modalAmount, 'withdraw', playerName, playerName, '07/06/2021', '12:12', modalReason, true);
                playerCash = Number(playerCash) + Number(modalAmount);
                renderPlayerCash();

                console.log(modalAmount)
                console.log(modalReason)

                //***************************************

                setTimeout(() => document.querySelector('.bg-modal').remove(), 1000);

                document.querySelectorAll('.account-card').forEach(e => (e.querySelector('.account-card-header').querySelector('p').textContent === accName + ' / ' + accNumber) ?
                    e.querySelector('.account-amount').textContent = '$' + (Number(e.querySelector('.account-amount').textContent.substring(1)) - Number(modalAmount)) : '')
            }
        }
    });

    accCardsList.lastChild.getElementsByClassName('transferBtn')[0].addEventListener('click', function () {

        const popUpModal = () => html`
            <div class="modal-contents">
                <div class="close">+</div>
                <div class="bankAccountName">${accName} / ${accNumber}</div>
                <div class="errorMsg"></div>
                <div class="form">
                    <input class="modalAmount" type="number" onkeydown="return event.keyCode !== 69" placeholder="$" />
                    <input class="modalInputId" type="number" onkeydown="return event.keyCode !== 69" placeholder="ID" />
                    <input class="modalReason" type="text" placeholder="Основание (1-100)" maxlength="100" />
                    <div class="modal-buttons">
                        <button class="modalCancelBtn">ОТКАЗ</button>
                        <button class="modalTransferBtn">ИЗПРАТИ</button>
                    </div>
                </div>
            </div>
            <label for="check" style="display: none">
                <div class="check-icon"></div>
            </label>
        `
        let tempChild = document.createElement('div');
        tempChild.className = 'bg-modal';
        document.getElementsByClassName('wrapper')[0].appendChild(tempChild)
        render(popUpModal(), document.getElementsByClassName('wrapper')[0].lastChild);

        document.querySelector('.bg-modal').style.display = 'flex';
        document.querySelector('.modalTransferBtn').style.display = "inline-block";

        document.getElementsByClassName('close')[0].addEventListener('click', () => closeModalWindow());
        document.getElementsByClassName('modalCancelBtn')[0].addEventListener('click', () => closeModalWindow());
        document.getElementsByClassName('modalTransferBtn')[0].addEventListener('click', () => submitData());

        function closeModalWindow() {
            if (document.querySelector('.bg-modal')) {
                document.querySelector('.bg-modal').remove();
            }
        }

        document.addEventListener('keydown', function (e) {
            if (e.key === "Escape") {
                closeModalWindow()
            }
        }, { once: true });

        function submitData() {
            let modalAmount = document.getElementsByClassName('modalAmount')[0].value;
            let modalInputId = document.getElementsByClassName('modalInputId')[0].value;
            let modalReason = document.getElementsByClassName('modalReason')[0].value;

            if (modalAmount === '' || Number(accAmount) - Number(modalAmount) < 0) {
                document.getElementsByClassName('modalAmount')[0].style.borderBottom = "2px solid #ff0000";
                document.querySelector('.errorMsg').style.display = 'block';
                document.querySelector('.errorMsg').textContent = 'Попълнете всички полета';
                if (Number(accAmount) - Number(modalAmount) < 0) {
                    document.querySelector('.errorMsg').textContent = 'Невалидна сума';
                }
            } else {
                document.getElementsByClassName('modalAmount')[0].style.borderBottom = "2px solid #ffffff";
            }

            if (modalInputId === '') {
                document.getElementsByClassName('modalInputId')[0].style.borderBottom = "2px solid #ff0000";
                document.querySelector('.errorMsg').style.display = 'block';
                document.querySelector('.errorMsg').textContent = 'Попълнете всички полета';
            } else {
                document.getElementsByClassName('modalInputId')[0].style.borderBottom = "2px solid #ffffff";
            }

            if (modalReason === '') {
                document.getElementsByClassName('modalReason')[0].style.borderBottom = "2px solid #ff0000";
                document.querySelector('.errorMsg').style.display = 'block';
                document.querySelector('.errorMsg').textContent = 'Попълнете всички полета';
            } else {
                document.getElementsByClassName('modalReason')[0].style.borderBottom = "2px solid #ffffff";
            }

            if (modalAmount !== '' && modalInputId !== '' && modalReason !== '' && Number(accAmount) - Number(modalAmount) >= 0) {

                // стигне ли до тук, значи всички полета са правилно запълнени и може да се праща заявка с данните (modalAmount, modalInputId и modalReason)
                // if we get here, this means the input values are correct and we can send a query with the data (modalAmount & modalReason)

                document.querySelector('.bankAccountName').remove();
                document.querySelector('.form').remove();
                document.querySelector('.errorMsg').remove();
                document.querySelector('label').style.display = 'inline-block';

                //example code (write the query here) ************************

                createTransactionCard(accName, accNumber, 'fbth-jkbg-vear-ybyh', modalAmount, 'transfer', playerName, 'Ivan Dobrev', '07/06/2021', '12:12', modalReason, true)

                console.log(modalAmount)
                console.log(modalInputId)
                console.log(modalReason)

                //***************************************


                setTimeout(() => document.querySelector('.bg-modal').remove(), 1000);

                document.querySelectorAll('.account-card').forEach(e => (e.querySelector('.account-card-header').querySelector('p').textContent === accName + ' / ' + accNumber) ?
                    e.querySelector('.account-amount').textContent = '$' + (Number(e.querySelector('.account-amount').textContent.substring(1)) - Number(modalAmount)) : '')
            }
        }
    });
}

function createTransactionCard(trAccName, trAccNum, trNumber, trAmount, trType, trSender, trRecipient, trDate, trTime, trReason, isTemp) {
    let trCard = () => html`
    <div class="transaction-card">
        <div class="transaction-card-header">
            <p class="transaction-account-and-method">
                ${trAccName} / ${trAccNum} ${trType === 'deposit' ? '[ДЕПОЗИТ]' : trType === 'withdraw' ? '[ИЗТЕГЛЯНЕ]' :
            trType === 'transfer' ? '[ТРАНСФЕР]' : ''}
            </p>
            <p class="transaction-string">
                ${trNumber}
            </p>
        </div>
        <div class="transaction-card-body">
            <div class="transaction-card-body-left">
                <p
                    class="${trType === 'deposit' || (trType === 'transfer' && trRecipient === playerName) ? 'transaction-amount' : 'transaction-amountRed'}">
                    $${trAmount}</p>
                <p class="transaction-recipient">
                    Получател: ${trRecipient}
                </p>
            </div>
            <div class="transaction-card-body-right">
                <p class="transaction-date-time">${trDate} ${trTime}</p>
                <p class="transaction-sender">Подател: ${trSender}</p>
            </div>
        </div>
        <div class="transaction-card-footer">
            <p class="transaction-message-message">
                Основание за транзакцията:
            </p>
            <p class="transaction-message-text">
                ${trReason}
            </p>
        </div>
    </div>
    `

    let tempChild = document.createElement('div');
    if (isTemp) {
        trCardsList.insertBefore(tempChild, trCardsList.firstChild);
        render(trCard(), trCardsList.firstChild)
    } else {
        trCardsList.appendChild(tempChild)
        render(trCard(), trCardsList.lastChild)
    }
}

function renderPlayerCash() {
    playerCashAmount.textContent = 'Cash: $' + playerCash;
}