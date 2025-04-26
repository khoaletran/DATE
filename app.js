(function(){
    emailjs.init('YxrXt54S8DotF1YQd');
})();

let userName = '', userEmail = '', selectedFood = '';

let foodArray = [];

function loadFoods() {
    fetch('data.txt')
        .then(response => response.text())
        .then(text => {
            const lines = text.trim().split('\n');
            foodArray = lines.map(line => {
                const [name, img] = line.split('|');
                return { name: name.trim(), img: img.trim() };
            });
            renderFoods();
        })
        .catch(error => {
            console.error('Lỗi tải món ăn:', error);
            alert('Không tải được món ăn, thử lại sau nhen Người Đẹp!');
        });
}

function goToStep2() {
    userName = document.getElementById('name').value.trim();
    userEmail = document.getElementById('email').value.trim();

    const gmailRegex = /^[a-zA-Z0-9._%+-]+@gmail\.com$/;

    if (!userName || !userEmail) {
        alert('Điền đầy đủ thông tin nhen Người Đẹp!');
        return;
    }

    if (!gmailRegex.test(userEmail)) {
        alert('Email phải là Gmail nhen Người Đẹp! Ví dụ: example@gmail.com');
        return;
    }

    document.getElementById('step1').style.display = 'none';
    document.getElementById('step2').style.display = 'block';
    loadFoods();
}


function renderFoods() {
    const foodList = document.getElementById('foodList');
    foodList.innerHTML = '';
    foodArray.forEach(food => {
        const div = document.createElement('div');
        div.className = 'food-item';
        div.innerHTML = `
            <img src="${food.img}" alt="${food.name}" style="width:100px; height:100px;">
            <p>${food.name}</p>
        `;
        div.onclick = () => selectFood(div, food.name);
        foodList.appendChild(div);
    });
}

function selectFood(div, foodName) {
    document.querySelectorAll('.food-item').forEach(item => item.classList.remove('selected'));
    div.classList.add('selected');
    selectedFood = foodName;
}

function goToStep3() {
    if (selectedFood) {
        document.getElementById('step2').style.display = 'none';
        document.getElementById('step3').style.display = 'block';
    } else {
        alert('Chọn món trước nhen Người Đẹp!');
    }
}

function sendMail() {
    openModal();
    const date = document.getElementById('date').value;
    const time = document.getElementById('time').value;
    const location = document.getElementById('location').value.trim();

    if (!date || !time || !location) {
        alert('Điền đủ thông tin hẹn hò nhen Người Đẹp!');
        return;
    }

    const selectedDateTime = new Date(`${date}T${time}`);
    const now = new Date();

    if (selectedDateTime <= now) {
        alert('Chọn ngày giờ tương lai nhen Người Đẹp! Đừng chọn quá khứ nha.');
        return;
    }

    if (location.length < 5) {
        alert('Địa điểm phải có ít nhất 5 ký tự nhen Người Đẹp!');
        return;
    }

    const bookingTime = `${date} lúc ${time}`;

    const params = {
        user_name: userName,
        selected_food: selectedFood,
        booking_time: bookingTime, 
        location: location,
        user_email: userEmail,
        from_name: 'Chàng trai bí ẩn',
    };


    const paramsMain = {
        user_name: userName,
        selected_food: selectedFood,
        booking_time: bookingTime, 
        location: location,
        user_email: 'khoaletran709@gmail.com',
        from_name: 'Chàng trai bí ẩn',
    };


    emailjs.send('khoaletran_709', 'template_ixeq81a', params)
    .then((response) => {
        console.log('SUCCESS', response);
        return emailjs.send('khoaletran_709', 'template_ixeq81a', paramsMain);
    })
    .catch((error) => {
        console.error('FAILED', error);
    });
}

function openModal() {
    document.getElementById('videoModal').style.display = 'flex';
    document.getElementById('loveVideo').play();
}

function closeModal() {
    document.getElementById('videoModal').style.display = 'none';
    document.getElementById('loveVideo').pause();
    document.getElementById('loveVideo').currentTime = 0; 
}
