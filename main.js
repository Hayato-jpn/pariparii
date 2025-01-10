const prefList = [
    {nameJa: '北海道', nameEn: 'hokkaido'},
    {nameJa: '青森県', nameEn: 'aomori'},
    {nameJa: '岩手県', nameEn: 'iwate'},
    {nameJa: '宮城県', nameEn: 'miyagi'},
    {nameJa: '秋田県', nameEn: 'akita'},
    {nameJa: '山形県', nameEn: 'yamagata'},
    {nameJa: '福島県', nameEn: 'fukushima'},
    {nameJa: '茨城県', nameEn: 'ibaraki'},
    {nameJa: '栃木県', nameEn: 'tochigi'},
    {nameJa: '群馬県', nameEn: 'gunma'},
    {nameJa: '埼玉県', nameEn: 'saitama'},
    {nameJa: '千葉県', nameEn: 'chiba'},
    {nameJa: '東京都', nameEn: 'tokyo'},
    {nameJa: '神奈川県', nameEn: 'kanagawa'},
    {nameJa: '新潟県', nameEn: 'niigata'},
    {nameJa: '富山県', nameEn: 'toyama'},
    {nameJa: '石川県', nameEn: 'ishikawa'},
    {nameJa: '福井県', nameEn: 'fukui'},
    {nameJa: '山梨県', nameEn: 'yamanashi'},
    {nameJa: '長野県', nameEn: 'nagano'},
    {nameJa: '岐阜県', nameEn: 'gifu'},
    {nameJa: '静岡県', nameEn: 'shizuoka'},
    {nameJa: '愛知県', nameEn: 'aichi'},
    {nameJa: '三重県', nameEn: 'mie'},
    {nameJa: '滋賀県', nameEn: 'shiga'},
    {nameJa: '京都府', nameEn: 'kyoto'},
    {nameJa: '大阪府', nameEn: 'osaka'},
    {nameJa: '兵庫県', nameEn: 'hyogo'},
    {nameJa: '奈良県', nameEn: 'nara'},
    {nameJa: '和歌山県', nameEn: 'wakayama'},
    {nameJa: '鳥取県', nameEn: 'tottori'},
    {nameJa: '島根県', nameEn: 'shimane'},
    {nameJa: '岡山県', nameEn: 'okayama'},
    {nameJa: '広島県', nameEn: 'hiroshima'},
    {nameJa: '山口県', nameEn: 'yamaguchi'},
    {nameJa: '徳島県', nameEn: 'tokushima'},
    {nameJa: '香川県', nameEn: 'kagawa'},
    {nameJa: '愛媛県', nameEn: 'ehime'},
    {nameJa: '高知県', nameEn: 'kochi'},
    {nameJa: '福岡県', nameEn: 'fukuoka'},
    {nameJa: '佐賀県', nameEn: 'saga'},
    {nameJa: '長崎県', nameEn: 'nagasaki'},
    {nameJa: '熊本県', nameEn: 'kumamoto'},
    {nameJa: '大分県', nameEn: 'oita'},
    {nameJa: '宮崎県', nameEn: 'miyazaki'},
    {nameJa: '鹿児島県', nameEn: 'kagoshima'},
    {nameJa: '沖縄県', nameEn: 'okinawa'}
];

const prefecturesSelect = document.getElementById('js-prefectures--select');
const municipalitiesSelect = document.getElementById('js-municipalities--select');
const resultDiv = document.getElementById('js-result');
const resultHitDiv = document.getElementById('js-result-hit');
const resultUnhitDiv = document.getElementById('js-result-unhit');
const prefecturesResult = document.getElementById('js-prefectures--result');
const municipalitiesResult = document.getElementById('js-municipalities--result');
const resultValRate = document.getElementById('js-result--rate');
const resultValAmount = document.getElementById('js-result--amount');
const resultValHowto = document.getElementById('js-result--howto');
const resultValDealer = document.getElementById('js-result--dealer');

const lpSettings  = {
    siteUrl: window.location.protocol + '//' + window.location.hostname + '/',
    lpUrl: window.location.href.replace(/\?.*$/, ''),
    csvUrl: '',
    csvUri: '../__data/',
    elemSelector: {
    },
}

const prefNameJa = prefList.map((x) => {
    return x.nameJa;
});
const prefNameEn = prefList.map((x) => {
    return x.nameEn;
});

const app = {
    init: function() {
//      lpSettings.csvUrl = lpSettings.lpUrl + lpSettings.csvUri;
        lpSettings.csvUrl = 'https://parisparis.homeshopping.co.jp/view/page/';

        app.setCopyright();
        smoothScroll();
        fiexdCta();
        faqToggle();
        selectSubsidyArea();
        buildOption(prefecturesSelect, prefNameJa, prefNameEn);
    },
    methods: function() {
    },
    setCopyright: function() {
        let now = new Date();
        let year = now.getFullYear();
        document.getElementById('year').textContent = year;
    },
};
app.init();



async function loadCSVData(_csv) {
    await fetch(lpSettings.csvUrl + _csv + '.csv')
    .then(res => {
        if (!res.ok) return Promise.reject(new Error(`res.status = ${res.status}, res.statusText = ${res.statusText}`));
        return res.text();
    })
    .then(text => {
        const parseCsv = csv => csv.replace(/\r/g, '').split('\n').reduce(([data, isInQuotes], line) => {
            const [datum, newIsInQuotes] = ((isInQuotes ? '"' : '') + line).split(',').reduce(([datum, isInQuotes], text) => {
                const match = isInQuotes || text.match(/^(\"?)((.*?)(\"*))$/);
                if (isInQuotes) datum[datum.length - 1] += ',' + text.replace(/\"+/g, m => '"'.repeat(m.length / 2));
                else datum.push(match[1] ? match[2].replace(/\"+/g, m => '"'.repeat(m.length / 2)) : match[2]);
                return [datum, isInQuotes ? !(text.match(/\"*$/)[0].length % 2) : match[1] && !(match[4].length % 2)];
            }, [[]])
            if (isInQuotes) data[data.length - 1].push(data[data.length - 1].pop() + '\n' + datum[0], ...datum.slice(1));
            else data.push(datum);
            return [data, newIsInQuotes];
        }, [[]])[0];
        const data = parseCsv(text);

        const optionDef = document.createElement('option');
        optionDef.value = '';
        optionDef.textContent = '選択する';
        municipalitiesSelect.innerHTML = '';
        municipalitiesSelect.appendChild(optionDef);

        data.slice(5).forEach((v, i) => {
            const option = document.createElement('option');
            option.value = v[1];
            option.dataset.availability = v[2];
            option.dataset.rate = v[3];
            option.dataset.amount = v[4];
            option.dataset.howto = v[7];
            option.dataset.dealer = v[8].replace(/\s+/g, '<br>');
            option.textContent = v[1];
            municipalitiesSelect.appendChild(option);
        });
    })
    .catch(err => {
        municipalitiesSelect.innerHTML = '';
        console.error('fetch error', err);
    });
}

function buildOption(_t, _items, _itemsVal=[]) {
    const optionDef = document.createElement('option');
    optionDef.value = '';
    optionDef.textContent = '選択する';
    _t.innerHTML = '';
    _t.appendChild(optionDef);

    _items.forEach((v, i) => {
        const option = document.createElement('option');
        if (_itemsVal.length) {
            option.value = _itemsVal[i];
        }
        else {
            option.value = v;
        }
        option.textContent = v;
        _t.appendChild(option);
    });
}

function selectSubsidyArea() {
    document.addEventListener('DOMContentLoaded', function() {
        prefecturesSelect.addEventListener('change', (e) => {
            hideSubsidyResult();
            if (e.target.value.length) {
                loadCSVData(e.target.value);
                prefecturesResult.textContent = prefecturesSelect.options[prefecturesSelect.selectedIndex].innerHTML;
            }
            else {
                municipalitiesSelect.innerHTML = '';
            }
        });

        municipalitiesSelect.addEventListener('change', (e) => {
            hideSubsidyResult();
            municipalitiesResult.textContent = e.target.value;
            viewSubsidyResult();
        });
    });
}

function viewSubsidyResult() {
    const availabilityVal = municipalitiesSelect.options[municipalitiesSelect.selectedIndex].getAttribute('data-availability');
    const rateVal = municipalitiesSelect.options[municipalitiesSelect.selectedIndex].getAttribute('data-rate');
    const amountVal = municipalitiesSelect.options[municipalitiesSelect.selectedIndex].getAttribute('data-amount');
    const howtoVal = municipalitiesSelect.options[municipalitiesSelect.selectedIndex].getAttribute('data-howto');
    const dealerVal = municipalitiesSelect.options[municipalitiesSelect.selectedIndex].getAttribute('data-dealer');

    if (availabilityVal === 'あり') {
        resultDiv.classList.add('visible');
        resultHitDiv.classList.add('visible');
        resultValRate.textContent = rateVal;
        resultValAmount.textContent = amountVal;
        resultValHowto.textContent = howtoVal;
        resultValDealer.innerHTML = dealerVal;
    }
    else if (availabilityVal === 'なし') {
        resultDiv.classList.add('visible');
        resultUnhitDiv.classList.add('visible');
    }
    else {
        hideSubsidyResult();
    }
}

function hideSubsidyResult() {
    resultDiv.classList.remove('visible');
    resultHitDiv.classList.remove('visible');
    resultUnhitDiv.classList.remove('visible');
}

function smoothScroll() {
    const smoothScrollTrigger = document.querySelectorAll('a[href^="#"]');
    for (let i = 0; i < smoothScrollTrigger.length; i++){
        smoothScrollTrigger[i].addEventListener('click', (e) => {
            e.preventDefault();
            let href = smoothScrollTrigger[i].getAttribute('href');
            let targetElement = document.getElementById(href.replace('#', ''));
            const rect = targetElement.getBoundingClientRect().top;
            const offset = window.pageYOffset;
            const target = rect + offset;
            window.scrollTo({
                top: target,
                behavior: 'smooth',
            });
        });
    }
}

function fiexdCta() {
    const fiexdCta = document.getElementById('js-fixed');
    const targetSection = document.getElementById('price');

    fiexdCtaHeight = fiexdCta.clientHeight;
    let body_element = document.body;

    body_element.style.marginBottom = fiexdCtaHeight + 'px';

    window.addEventListener('scroll', function() {
        let scrollPosition = window.scrollY;
        const targetPosition = targetSection.offsetTop;
        const hiddenArea = scrollPosition - targetPosition;

        if (hiddenArea >= -1000 && hiddenArea <= 500) {
            fiexdCta.classList.remove('visible');
        } else {
            fiexdCta.classList.add('visible');
        }
    });
}

function faqToggle() {
    const toggleSwitches = document.querySelectorAll('.faq--toggle');

    toggleSwitches.forEach(function(toggleSwitch) {
        toggleSwitch.addEventListener('click', function() {
            const question = this.firstElementChild;
            question.classList.toggle('open');
            const ancer = this.lastElementChild;
            ancer.classList.toggle('open');

            if (ancer.classList.contains('open')) {
                ancer.style.height = ancer.scrollHeight + 'px';
            } else {
                ancer.style.height = "0";
            }
        });
    });
}