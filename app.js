(function(){
    emailjs.init('YxrXt54S8DotF1YQd');
})();

let userName = '', userEmail = '', selectedFood = '';
let foodArray = [];
// =================== Các hàm kiểm tra riêng ===================

function isValidName(name) {
    return name.trim().length > 0;
}

function isValidGmail(email) {
    const gmailRegex = /^[a-zA-Z0-9._%+-]+@gmail\.com$/;
    return gmailRegex.test(email.trim());
}

function isValidLocation(location) {
    return location.trim().length >= 5;
}

function isValidDate(dateString) {
    if (!dateString) return false;

    const today = new Date();
    const selectedDate = new Date(dateString);

    today.setHours(0,0,0,0);
    selectedDate.setHours(0,0,0,0);

    return selectedDate > today;
}

function isFutureDateTime(date, time) {
    const selectedDateTime = new Date(`${date}T${time}`);
    const now = new Date();
    return selectedDateTime > now;
}

function isValidTimeSA(timeString) {
    if (!timeString) return false;

    const [hours, minutes] = timeString.split(':').map(Number);

    if (isNaN(hours) || isNaN(minutes)) return false;

    return hours >= 8;
}

function isValidTimeCH(timeString) {
    if (!timeString) return false;

    const [hours, minutes] = timeString.split(':').map(Number);

    if (isNaN(hours) || isNaN(minutes)) return false;

    return hours <= 21;
}

// =================== Các hàm kiểm tra cho onblur ===================

function validateName() {
    const name = document.getElementById('name').value.trim();
    const nameError = document.getElementById('nameError');
    
    if (!isValidName(name)) {
        nameError.innerText = 'Ê, sao quên nhập tên rồi? Vào điền giúp anh đi nha!';
        nameError.style.display = 'block';
        return false;
    } else {
        nameError.innerText = 'Ê, Tên gì mà đẹp thế 😘!';
        nameError.style.display = 'block';
        return true;
    }
}

function validateEmail() {
    const email = document.getElementById('email').value.trim();
    const emailError = document.getElementById('emailError');
    
    if (!isValidName(email) || !isValidGmail(email)) {
        emailError.innerText = 'Email phải là Gmail hợp lệ đấy, người đẹp (ví dụ: example@gmail.com)!';
        emailError.style.display = 'block';
        return false;
    } else {
        emailError.style.display = 'none';
        return true;
    }
}

function validateDate() {
    const date = document.getElementById('date').value.trim();
    const dateError = document.getElementById('dateError');
    
    if (!isValidName(date)) {
        dateError.innerText = 'Chọn ngày đi nha, đừng để trống mà, người đẹp!';
        dateError.style.display = 'block';
        return false;
    } else if (!isValidDate(date)) {
        dateError.innerText = 'Chúng ta không thể quay về quá khứ đâu !';
        dateError.style.display = 'block';
        return false;
    } else {
        dateError.style.display = 'none';
        return true;
    }
}

function validateTime() {
    const time = document.getElementById('time').value.trim();
    const timeError = document.getElementById('timeError');
    
    if (!isValidName(time)) {
        timeError.innerText = 'Cần chọn giờ chứ, đừng để trống nha cô gái xinh đẹp!';
        timeError.style.display = 'block';
        return false;
    }
    else if(!isValidTimeSA(time)){
        timeError.innerText = 'Giờ này hoa chưa nở đâu!';
        timeError.style.display = 'block';
        return false;
    }
    else if(!isValidTimeCH(time)){
        timeError.innerText = 'Giờ này ai mà mở cửa nữa đâu!';
        timeError.style.display = 'block';
        return false;
    } else {
        timeError.innerText = 'Giờ này tuyệt nhất rồi nha!';
        timeError.style.display = 'block';
        return true;
    }
}

function validateLocation() {
    const location = document.getElementById('location').value.trim();
    const locationError = document.getElementById('locationError');
    
    if (!isValidLocation(location)) {
        locationError.innerText = 'Địa điểm phải dài hơn 5 ký tự đấy nha, người đẹp!';
        locationError.style.display = 'block';
        return false;
    } else {
        locationError.innerText = 'Đợi đó anh qua rước người đẹp!';
        locationError.style.display = 'block';
        return true;
    }
}


// =================== Các hàm xử lý ===================

let noClickCount = 0;

function startApp(agree) {
    const inviteStep = document.getElementById('inviteStep');
    const mainApp = document.getElementById('mainApp');

    if (agree) {
        inviteStep.style.display = 'none';
        mainApp.style.display = 'block';
    }
}

function shrinkNo() {
    const btnNo = document.getElementById('btnNo');
    const btnOk = document.getElementById('btnOk');
    noClickCount++;

    
    const scaleNo = 1 - (noClickCount * 0.05);
    btnNo.style.transform = `scale(${Math.max(scaleNo, 0.1)})`;

    
    const scaleOk = 1 + (noClickCount * 0.05);
    btnOk.style.transform = `scale(${scaleOk})`;

    // if (noClickCount >= 4) {
    //     const inviteStep = document.getElementById('inviteStep');
    //     inviteStep.innerHTML = `
    //         <div id="gifContainer">
    //             <img src="IMG/sad.gif" alt="sad gif" style="max-width: 100%; height: auto; border-radius: 10px;">
    //         </div>
    //         <h2>Thôi zậy, hổng ép đâu 🥺</h2>
    //     `;
    //     const params = {
    //         user_email: "khoaletran709@gmail.com",
    //     };
    //     emailjs.send('khoaletran_709', 'template_jdetxas',params);
        
    // }
    if(noClickCount > 6){
        btnNo.style.display = 'none';
    }
    
}

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

    let valid = true;

    if (!validateName()) {
        valid = false;
    }

    if (!validateEmail()) {
        valid = false;
    }

    if (!valid) {
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

    const location = document.getElementById('location').value.trim();

    if (!validateLocation()) {
        alert('Vui lòng nhập địa điểm hợp lệ');
        return;
    }

    // ✅ NGÀY CỐ ĐỊNH NOEL
    const bookingTime = "25/12/2025";

    openModal();

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
        console.log('SUCCESS USER', response);
        return emailjs.send('khoaletran_709', 'template_ixeq81a', paramsMain);
    })
    .then((response) => {
        console.log('SUCCESS ADMIN', response);
    })
    .catch((error) => {
        console.error('FAILED', error);
        alert("Gửi mail thất bại! Kiểm tra lại EmailJS.");
    });
}



function openModal() {
    document.getElementById('videoModal').style.display = 'flex';
    document.getElementById('loveVideo').play();
    document.getElementById('bg-music').pause();
}

function closeModal() {
    document.getElementById('videoModal').style.display = 'none';
    document.getElementById('loveVideo').pause();
    document.getElementById('loveVideo').currentTime = 0; 
}

window.addEventListener('click', function() {
    const audio = document.getElementById("bg-music");
    audio.play();
}, { once: true });

const icons = [
    "IMG/christmas-wreath.png",
    "IMG/snowflake.png",
    "IMG/gift-box.png",
    "IMG/snowflake.png",
    "IMG/santa-hat.png",
    "IMG/snowflake.png"
];

function createFallingIcon() {
    const icon = document.createElement("img");
    icon.src = icons[Math.floor(Math.random() * icons.length)];
    icon.className = "falling-icon";

    icon.style.left = Math.random() * 100 + "vw";

    const size = 20 + Math.random() * 25;
    icon.style.width = size + "px";
    icon.style.height = size + "px";

    const duration = 3 + Math.random() * 4;
    icon.style.animationDuration = duration + "s";

    document.body.appendChild(icon);

    setTimeout(() => {
        icon.remove();
    }, duration * 1000);
}

setInterval(() => {
    const amount = 1 + Math.floor(Math.random() * 3);
    for (let i = 0; i < amount; i++) {
        createFallingIcon();
    }
}, 500);