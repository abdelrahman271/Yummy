$('#navtoggle').on('click', function() {
    if ($('#navtoggle').hasClass('clicked')) {
        $('.leftnav').animate({'left': '-250px'}, 400);
        $('.rightnav').animate({'margin-left': '0px'}, 400);
        $('ul li').each(function(index) {
            $(this).delay(100 * index).animate({'top': '150px'}, 400);
        });
        $('#navtoggle').html('<i class="fa-solid open-close-icon fa-2x fa-align-justify"></i>');
        $('#navtoggle').removeClass('clicked');
    }else {
        $('.leftnav').animate({'left': '0px'}, 400, function() {
            $('ul li').each(function(index) {
                $(this).delay(100*index).animate({'top': '0px'}, 400);
            });
        });
        $('.rightnav').animate({'margin-left': '249px'}, 400);
        $('#navtoggle').html('<i class="fa-solid open-close-icon fa-2x fa-x"></i>');
        $('#navtoggle').addClass('clicked');
    }
});

function setnav(){
    $('.leftnav').animate({'left': '-250px'}, 400);
    $('.rightnav').animate({'margin-left': '0px'}, 400);
    $('#navtoggle').html('<i class="fa-solid open-close-icon fa-2x fa-align-justify"></i>');

}
let current="";


//========================================<Main>==================================================


async function getRandomMeals() {
    $('.load').removeClass('d-none');
    $('.website').addClass('d-none');
    let meals = [];
    for (let i = 0; i < 24; i++) {
        let response = await fetch('https://www.themealdb.com/api/json/v1/1/random.php');
        let result = await response.json();
        meals.push(result.meals[0]);
    }
    displayRandomMeals(meals);
    $('.website').removeClass('d-none');
    $('.load').addClass('d-none');
    $('.search').addClass('d-none');
    $('.category').addClass('d-none');
    $('.details-meals').addClass('d-none');
    $('.area').addClass('d-none');
    $('.ingredients').addClass('d-none');
    $('.contact').addClass('d-none');
    $('.meals').removeClass('d-none');
    current="";
}

$('.logo').on('click',function(){
    getRandomMeals();
})

getRandomMeals();

function displayRandomMeals(meals) {
    let cartona = "";
    for (var i = 0; i < meals.length; i++) {
        cartona += `
            <div class="col-md-3 mb-4 items" id="${meals[i].idMeal}">
                <div class="mealbox position-relative overflow-hidden">
                    <img src="${meals[i].strMealThumb}" alt="" class="w-100 rounded-2">
                    <div class="layer rounded-2 p-2 d-flex justify-content-start align-items-center">
                        <h3>${meals[i].strMeal}</h3>
                    </div>
                </div>
            </div>`;
    }
    $('#randmeals').html(cartona);
    $(document).on('click', '.items', function(){
        let meal=$(this).attr('id');
        setnav();
        getdetailmeal(meal);        
    })
}

async function getdetailmeal(meal){
    $('.load').removeClass('d-none');
    $('.website').addClass('d-none');
    let response = await fetch(`https://www.themealdb.com/api/json/v1/1/lookup.php?i=${meal}`);
    let result = await response.json();
    displaydetails(result.meals[0]);
    $('.website').removeClass('d-none');
    $('.load').addClass('d-none');
    $('.search').addClass('d-none');
    $('.meals').addClass('d-none');
    $('.category').addClass('d-none');
    $('.ingredients').addClass('d-none');
    $('.area').addClass('d-none');
    $('.contact').addClass('d-none');
    $('.details-meals').removeClass('d-none');

}

function displaydetails(detail){
    let ingredient = '';
    for (var i = 0; i <= 20; i++) {
        if (detail[`strIngredient${i}`] && detail[`strMeasure${i}`]) {
            ingredient += `<span class="alert alert-info mx-1 p-1">${detail[`strMeasure${i}`]} ${detail[`strIngredient${i}`]}</span>`;
        }
    }
    let cartona = `
    <div class="col-md-4">
        <img src="${detail.strMealThumb}" class="w-100 rounded-2 mb-3" alt="">
        <h1>${detail.strMeal}</h1>
    </div>
    <div class="col-md-8">
        <div class="d-flex justify-content-between align-items-center">
        <h1>Instructions</h1>
        <button type="button" class="btn-close btn-close-white" aria-label="Close" onclick="closeDetails()"></button>
        </div>
        <p>${detail.strInstructions}</p>
        <h1>Area : ${detail.strArea}</h1>
        <h1>Category : ${detail.strCategory}</h1>
        <h1>Recipes :</h1>
        <div class="d-flex flex-wrap align-items-center mt-3">
            ${ingredient}
        </div>
        <h1 class="mb-3">Tags:</h1>
        ${detail.strTags ?detail.strTags.split(',').map(tag => `<span class="ext-white alert alert-danger mx-1 p-1">${tag}</span>`).join('') : ''}
        <div class="d-flex my-3">
            <a target="_blank" href="${detail.strSource || '#'}" class="btn btn-success me-2">Source</a>
            <a target="_blank" href="${detail.strYoutube || '#'}" class="btn btn-danger">YouTube</a>
        </div>
    </div>`;
    $('#detailsmeals').html(cartona);
}

function closeDetails(){
    if(current==='search'){
        $('.category').addClass('d-none');
        $('.ingredients').addClass('d-none');
        $('.area').addClass('d-none');
        $('.details-meals').addClass('d-none');
        $('.contact').addClass('d-none');
        $('.meals').addClass('d-none');
        $('.search').removeClass('d-none');
    }

    else{
        $('.search').addClass('d-none');
        $('.category').addClass('d-none');
        $('.ingredients').addClass('d-none');
        $('.area').addClass('d-none');
        $('.details-meals').addClass('d-none');
        $('.contact').addClass('d-none');
        $('.meals').removeClass('d-none');
} 
}


//===========================================<Search>============================================


$('#Search').on('click', function() {
    setnav();
    showinput();
    $('.category').addClass('d-none');
    $('.ingredients').addClass('d-none');
    $('.area').addClass('d-none');
    $('.details-meals').addClass('d-none');
    $('.contact').addClass('d-none');
    $('.meals').addClass('d-none');
    $('.search').removeClass('d-none');
    current='search';
});

async function searchbyname(name){
    $('#search').html('');
    $('.load').removeClass('d-none');
    try {
        let response = await fetch(`https://www.themealdb.com/api/json/v1/1/search.php?s=${name}`);
        let result = await response.json();
        result.meals ? displaysearch(result.meals) : displaysearch([]);
    } 
    catch (error) {
        displaysearch([]);
    }

    $('.load').addClass('d-none');
}

async function searchbyletter(letter){
    $('#search').html('');
    $('.load').removeClass('d-none');
    try {
        let response = await fetch(`https://www.themealdb.com/api/json/v1/1/search.php?f=${letter}`);
        let result = await response.json();
        result.meals ? displaysearch(result.meals) : displaysearch([]);
    }
    catch (error) {
        displaysearch([]);
    }

    $('.load').addClass('d-none');

}

function displaysearch(meals) {
    let cartona = "";
    for (var i = 0; i < meals.length; i++) {
        cartona += `
            <div class="col-md-3 mb-4 items" id="${meals[i].idMeal}">
                <div class="mealbox position-relative overflow-hidden">
                    <img src="${meals[i].strMealThumb}" alt="" class="w-100 rounded-2">
                    <div class="layer rounded-2 p-2 d-flex justify-content-start align-items-center">
                        <h3>${meals[i].strMeal}</h3>
                    </div>
                </div>
            </div>`;
    }
    $('#search').html(cartona);
    $(document).on('click', '.items', function(){
        let meal=$(this).attr('id');
        setnav();
        getdetailmeal(meal);        
    })
}

function showinput(){
    let cartona=`
    <div class="row px-md-5 mt-1 g-3 ">
            <div class="col-md-6">
            <input type="text" placeholder="Search By Name" class="form-control" onkeyup="searchbyname(this.value)">
            </div>
            <div class="col-md-6">
            <input type="text" placeholder="Search By First Letter" class="form-control col-md-6" maxlength="1" onkeyup="searchbyletter(this.value)">
            </div>
            
        </div>
        <div class="row g-4 mt-4" id="search"></div>`
    $('#s').html(cartona);
}


//=======================================<Category>==============================================


$('#Category').on('click', function() {
    setnav();
    getcategory();
    $('.category').removeClass('d-none');
    $('.ingredients').addClass('d-none');
    $('.area').addClass('d-none');
    $('.details-meals').addClass('d-none');
    $('.contact').addClass('d-none');
    $('.meals').addClass('d-none');
    $('.search').addClass('d-none');
    current=""
});

async function getcategory() {
    $('.load').removeClass('d-none');
    $('.website').addClass('d-none');
    let response = await fetch('https://www.themealdb.com/api/json/v1/1/categories.php');
    let result = await response.json();
    let categories = result.categories;  
    displaycategory(categories);
    $('.website').removeClass('d-none');
    $('.load').addClass('d-none');
}

function displaycategory(categories) {
    let cartona = "";
    for (let i = 0; i < categories.length; i++) {
        cartona += `
            <div class="col-md-3 mb-4 items" id="${categories[i].strCategory}">
                <div class="mealbox position-relative overflow-hidden")>
                    <img src="${categories[i].strCategoryThumb}" alt="" class="w-100 rounded-2">
                    <div class="layer rounded-2 text-center p-1">
                        <h3 class="text-center">${categories[i].strCategory}</h3>
                        <ptext-black class="">${categories[i].strCategoryDescription.split(' ').slice(0,20).join(' ')}</p>
                    </div>
                </div>
            </div>`;
    }
    document.getElementById('categorymeals').innerHTML = cartona;

    $(document).on('click', '.items', function(){
        let category=$(this).attr('id');
        setnav();
        getcategorymeal(category);        
    })
}

async function getcategorymeal(category){
    $('.website').addClass('d-none');
    $('.load').removeClass('d-none');
    let response = await fetch(`https://www.themealdb.com/api/json/v1/1/filter.php?c=${category}`);
    let result = await response.json();
    displayRandomMeals(result.meals);
    $('.website').removeClass('d-none');
    $('.load').addClass('d-none');
    $(".category").addClass('d-none');
    $('.meals').removeClass('d-none');
    
}


//=======================================<Area>======================================================


$('#Area').on('click',function(){
    setnav();
    getarea();
    $('.category').addClass('d-none');
    $('.ingredients').addClass('d-none');
    $('.area').removeClass('d-none');
    $('.details-meals').addClass('d-none');
    $('.contact').addClass('d-none');
    $('.meals').addClass('d-none');
    $('.search').addClass('d-none');
    current=""

})
async function getarea() {
    $('.load').removeClass('d-none');
    $('.website').addClass('d-none');
    let response = await fetch('https://www.themealdb.com/api/json/v1/1/list.php?a=list');
    let result = await response.json();
    displayarea(result.meals);
    $('.website').removeClass('d-none');
    $('.load').addClass('d-none');
}
function displayarea(area){
    let cartona = "";
    for (let i = 0; i < area.length; i++) {
        cartona += `
            <div class="col-md-3 mb-4 items" id="${area[i].strArea}">
                <i class="fa-solid fa-house-laptop mb-2"></i>
                <h2>${area[i].strArea}</h2>
            </div>`;
    }
    document.getElementById('area').innerHTML = cartona;

    $(document).on('click', '.items', function(){
        let area=$(this).attr('id');
        setnav();
        getareameal(area);        
    })
}
async function getareameal(area){
    $('.website').addClass('d-none');
    $('.load').removeClass('d-none');
    let response = await fetch(`https://www.themealdb.com/api/json/v1/1/filter.php?a=${area}`);
    let result = await response.json();
    displayRandomMeals(result.meals);
    $('.website').removeClass('d-none');
    $('.load').addClass('d-none');
    $('.area').addClass('d-none')
    $('.meals').removeClass('d-none');
    
}


//=====================================<Ingredients>=============================================

$('#Ingredients').on('click',function(){
    setnav();
    getingredients();
    $('.category').addClass('d-none');
    $('.ingredients').removeClass('d-none');
    $('.area').addClass('d-none');
    $('.details-meals').addClass('d-none');
    $('.contact').addClass('d-none');
    $('.meals').addClass('d-none');
    $('.search').addClass('d-none');
    current=""

})
async function getingredients() {
    $('.load').removeClass('d-none');
    $('.website').addClass('d-none');
    let response = await fetch('https://www.themealdb.com/api/json/v1/1/list.php?i=list');
    let result = await response.json();
    displayingredients(result.meals.slice(0,24));
    $('.website').removeClass('d-none');
    $('.load').addClass('d-none');
}
function displayingredients(ingredients){
    let cartona = "";
    for (let i = 0; i < ingredients.length; i++) {
        cartona += `
            <div class="col-md-3 mb-4 items" id="${ingredients[i].strIngredient}">
                <i class="fa-solid fa-drumstick-bite fa-4x text-white text-center" mb-2"></i>
                <h2>${ingredients[i].strIngredient}</h2>
                <p>${ingredients[i].strDescription.split(' ').slice(0,20).join(' ')}</p>
            </div>`;
    }
    document.getElementById('ingredients').innerHTML = cartona;
    $(document).on('click', '.items', function(){
        let area=$(this).attr('id');
        setnav();
        getingredientsmeal(area);        
    })
}
async function getingredientsmeal(ingredientmeal){
    $('.website').addClass('d-none');
    $('.load').removeClass('d-none');
    let response = await fetch(`https://www.themealdb.com/api/json/v1/1/filter.php?i=${ingredientmeal}`);
    let result = await response.json();
    displayRandomMeals(result.meals);
    $('.website').removeClass('d-none');
    $('.load').addClass('d-none');
    $('.ingredients').addClass('d-none');
    $('.meals').removeClass('d-none');
    
}

//===================================<Contact Us>================================================

$('#Contact').on('click',function(){
    setnav();
    showcontact();
    $('.ingredients').addClass('d-none');
    $('.area').addClass('d-none');
    $('.details-meals').addClass('d-none');
    $('.meals').addClass('d-none');
    $('.search').addClass('d-none');
    $('.category').addClass('d-none');
    $('.contact').removeClass('d-none');
})

function showcontact(){
    let cartona=`
        <div class="col-md-6">
                <input type="text" placeholder="Enter Your Name" class="name form-control w-100">
                <div class="alert alert-danger message-name d-none">Special characters and numbers not allowed</div>
            </div>
            <div class="col-md-6">
                <input type="email" placeholder="Enter Your Email" class="email form-control w-100">
                <div class="alert alert-danger message-email d-none">Email not valid *exemple@yyy.zzz</div>
            </div>
            <div class="col-md-6">
                <input type="text" placeholder="Enter Your Phone" class="phone form-control w-100">
                <div class="alert alert-danger message-phone d-none">Enter valid Phone Number</div>
            </div>
            <div class="col-md-6">
                <input type="number" placeholder="Enter Your Age" class="age form-control w-100">
                <div class="alert alert-danger message-age d-none">Enter valid age</div>
            </div>
            <div class="col-md-6">
                <input type="password" placeholder="Enter Your Password" class="password form-control w-100">
                <div class="alert alert-danger message-password d-none">Enter valid password *Minimum eight characters, at least one letter and one number:*</div>
            </div>
            <div class="col-md-6">
                <input type="password" placeholder="Repassword" class="repassword form-control w-100">
                <div class="alert alert-danger message-repassword d-none">Enter valid repassword</div>
            </div>
            <div class="col-12 text-center" >
                <button class="btn btn-outline-danger submit my-3 disabled">Submit</button>
                <div class="alert alert-success message-submit d-none">Submit Successful</div>
            </div>
    `
    $('#contact').html(cartona);
}
let nameregex = /^[a-zA-Z\s]+$/;
let emailregex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
let phoneregex = /^\+?(\d{3})-?(\d{3})-?(\d{4,6})$/;
let ageregex = /^(?:[1-9][0-9]?|1[01][0-9]|120)$/;
let passwordregex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/;

let username = false;
let email = false;
let phone = false;
let age = false;
let password = false;
let repassword = false;


$(document).on('input', '.name', function() {
    let usernameValid = nameregex.test($('.name').val());
    $('.message-name').toggleClass('d-none', usernameValid);
    username = usernameValid;
    validate();
});

$(document).on('input', '.email', function() {
    let emailValid = emailregex.test($('.email').val());
    $('.message-email').toggleClass('d-none', emailValid);
    email = emailValid;
    validate();
});

$(document).on('input', '.phone', function() {
    let phoneValid = phoneregex.test($('.phone').val());
    $('.message-phone').toggleClass('d-none', phoneValid);
    phone = phoneValid;
    validate();
});

$(document).on('input', '.age', function() {
    let ageValid = ageregex.test($('.age').val());
    $('.message-age').toggleClass('d-none', ageValid);
    age = ageValid;
    validate();
});

$(document).on('input', '.password', function() {
    let passwordValid = passwordregex.test($('.password').val());
    $('.message-password').toggleClass('d-none', passwordValid);
    password = passwordValid;
    validate();
});

$(document).on('input', '.repassword', function() {
    let repasswordValid = $('.password').val() === $('.repassword').val();
    $('.message-repassword').toggleClass('d-none', repasswordValid);
    repassword = repasswordValid;
    validate();
});

function validate() {
    if (username && email && phone && age && password && repassword) {
        $('.submit').removeClass('disabled');
    } else {
        $('.submit').addClass('disabled');

    }
}

$(document).on('click','input',function(){
    validate();
})

$(document).on('click','.submit',function(){
    $('.name').val('');
    $('.email').val('');
    $('.age').val('');
    $('.phone').val('');
    $('.password').val('');
    $('.repassword').val('');
    $('.message-submit').removeClass('d-none');
})