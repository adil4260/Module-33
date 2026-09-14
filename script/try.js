const loadLesson = () => {
    fetch("https://openapi.programming-hero.com/api/levels/all")  //promise of response
        .then(res => res.json()) //promise of json data
        .then(json => displayLesson(json.data))
};

const displayLesson = (lessons) => {
    console.log(lessons)
}
loadLesson();
