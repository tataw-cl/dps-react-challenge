// Code for the CRM component
import { useState, useEffect } from 'react'
//interface for the users data and types
interface Users{
    firstName: string;
    lastName: string;
    birthday: string;
    id: string;
    city: string;
}

export const CRM = () => {
    //variable for the user's datanof type Users
    const [Users, setUsers]= useState<Users[]>([]);
    // const [searchTerm, setSearchTerm]= useState('');
    const [selectedCity, setSelectedCity]= useState('');
    const [highlightOldest, setHighlightOldest]= useState(false);
    const [nameFilter, setNameFilter] = useState('');
    const [debouncedNameFilter, setDebouncedNameFilter] = useState(nameFilter);
    useEffect(()=> {
        //Async function to fetch the data from the API
        const fetchData = async()=>{
            try{
                const response=await fetch('https://dummyjson.com/users');
                if(!response.ok){
                    throw new Error('Something went wrong with response ' + response.statusText);
                }
                const data = await response.json();
                //Loggin User data to console to see the structure of the data
                console.log(data);
                //filtering the data to get only the required fields
                const filteredUserData=data.users.map((user: any)=>({
                    firstName: user.firstName,
                    lastName: user.lastName,
                    birthday: user.birthDate,
                    id: user.id,
                    city: user.address.city
                }));

                //setting the filtered data to the User state variable
                setUsers(filteredUserData);
                console.log(Users);
            } catch(error){
                console.error('There was an error in the fetch operation' + error);
            }
        }
        fetchData();
    }, []);

    //Debouncing the search term to avoid multiple API calls
    useEffect(() => {
        const handler = setTimeout(() => {
            setDebouncedNameFilter(nameFilter);
        }, 1000);

        return () => {
            clearTimeout(handler);
        };
    }, [nameFilter]);

    const filteredUsers = Users.filter((user:Users) =>( 
        user.firstName.toLowerCase().includes(debouncedNameFilter.toLowerCase()) ||
        user.lastName.toLowerCase().includes(debouncedNameFilter.toLowerCase())) && (selectedCity? user.city === selectedCity: true)
         ).slice(0,10);

//Function to get the oldest user per city
const getOldestUsersByCity=(users: Users[])=>{
    const oldestUsers:{[key: string]: Users}={};
    //Iterating through the user's data to get the oldest user per city
    users.forEach((user: Users) => {
        if(!oldestUsers[user.city] || user.birthday > oldestUsers[user.city].birthday){
            oldestUsers[user.city]=user;
        }
        
    });
 return oldestUsers;
}
//calling the function to get the oldest user per city
const oldestUsers= getOldestUsersByCity(Users);

//Function to handle user selection
const handleUserSelect=(user: Users)=>{
    //Setting the name filter to the selected user's name via an onclick event
    setNameFilter(`${user.firstName} ${user.lastName}`);
}

    return (
    <>
        <div className="container">
            <div className="searchBar">
                {/* Input field to search the user by name */}
                <div className="searchBox Inputs">
                <label>Name Filter</label>
                <input 
                id='search_text'
                    type="text" 
                    value={nameFilter} 
                    onChange={(e) => setNameFilter(e.target.value)} 
                />
            </div>
            {/* Dropdown to select the city */}
                <div className="dropDown Inputs">
                    <label>City</label>
                    <select onChange={(e)=>setSelectedCity(e.target.value)}>
                        <option value="">Select city</option>
                        {Users.map((user: Users)=>(
                            <option id={user.id} value={user.city}>{user.city}</option>
                        ))}
                    </select>
                </div>
                {/* Checkbox to highlight the oldest user per city if clicked */}
                <div className="checkBox">
                    <p>Highest oldest per city</p>
                <label><input type="checkbox" checked={highlightOldest} onChange={(e)=>setHighlightOldest(e.target.checked)}/> </label>
                </div>
            </div>
            {/* Div to display the user data in the UI */}
            <div className="userList">
            <div className='checkBox'>
                        <label><h2>Name</h2></label>
                        <label><h2>City</h2></label>
                        <label><h2>Birthday</h2></label>  
                    </div>
                    <hr /> 
            {filteredUsers.map((user: Users)=>(
                <div key={user.id} onClick={()=> handleUserSelect(user)}>
                    {/*Displaying the user data in the UI and include oldest per city if clicked */}
                    <div key={user.id} id='highlight' className= {`${highlightOldest && oldestUsers[user.city]?.id === user.id ? 'highlight checkBox' : 'checkBox'}`}>
                        <label>{user.firstName} {user.lastName}</label>
                        <label>{user.city}</label>
                        <label>{user.birthday}</label>
                    </div>
                </div>
               ))}
            </div>
        </div>
    </>
  )
}
