const loadLesson = () => {
    fetch("https://openapi.programming-hero.com/api/levels/all")  //promise of response
        .then(res => res.json()) //promise of json data
        .then(json => displayLesson(json.data))
};


const loadLevelWord = (id) => {
    manageSpinner(true);

    const url = `https://openapi.programming-hero.com/api/level/${id}`;

    fetch(url)
        .then((res) => res.json())
        .then((data) => {
            removeActive(); // remove all active class
            const clickBtn = document.getElementById(`lesson-btn-${id}`);
            clickBtn.classList.add("active"); // add active class
            displayLevelWord(data.data);
        });
};

const displayLesson = (lessons) => {

    //    1.get the container & empty
    const levelContainer = document.getElementById("level-conttainer");
    levelContainer.innerHTML = "";

    // 2.get into every lesson 
    for (let lesson of lessons) {

        // 3.create Element
        const btnDiv = document.createElement("div");
        btnDiv.innerHTML = `
        <button onclick="loadLevelWord(${lesson.level_no})" class="btn btn-outline btn-primary" href=""><i class="fa-solid fa-book-open"></i> Lesson -${lesson.level_no}
        </button>
`;
        // 4.append into container
        levelContainer.append(btnDiv)
    }

}
loadLesson();
