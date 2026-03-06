const submitData = async () => {

    let firstNameDOM = document.querySelector('input[name=firstname]');
    let lastNameDOM = document.querySelector('input[name=lastname]');
    let ageDOM = document.querySelector('input[name=age]');
    let genderDOM = document.querySelector('input[name=gender]:checked');
    let interestDOMs = document.querySelectorAll('input[name=interests]:checked');
    let descriptionDOM = document.querySelector('textarea[name=description]');
    let messageDom = document.getElementById('message');

    let interest = '';

    for (let i = 0; i < interestDOMs.length; i++) {
        interest += interestDOMs[i].value;

        if (i != interestDOMs.length - 1) {
            interest += ',';
        }
    }

    let userData = {
        firstname: firstNameDOM.value,
        lastname: lastNameDOM.value,
        age: ageDOM.value,
        gender: genderDOM ? genderDOM.value : '',
        interests: interest,
        description: descriptionDOM.value
    };

    console.log("SEND DATA :", userData);

    try {

        const response = await axios.post(
            'http://localhost:8000/users',
            userData
        );

        console.log(response);

        messageDom.innerText = "บันทึกข้อมูลสำเร็จ";
        messageDom.className = "message success";

    } catch (error) {

        console.log(error);

        messageDom.innerText = "เกิดข้อผิดพลาด";
        messageDom.className = "message danger";
    }
};
