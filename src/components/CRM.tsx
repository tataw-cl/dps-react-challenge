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
    const [searchTerm, setSearchTerm]= useState('');
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
    const filteredUsers=searchTerm ? Users.filter((user: Users)=> user.firstName.toLowerCase().includes(searchTerm.toLowerCase() )||
    user.lastName.toLowerCase().includes(searchTerm.toLowerCase())).slice(0,10): [];

    return (
    <>
        {/* <div>
            {Users.map((user: Users)=>(
                <div key={user.id}>
                    <h1>{user.firstName} {user.lastName}</h1>
                    <p>Birthday: {user.birthday}</p>
                </div>
            ))}

        </div> */}
        <div className="container">
            <div className="searchBar">
                <div className="searchBox Inputs">
                    <label>Name</label>
                    <input id='search_text' type="text" placeholder='' value={searchTerm} onChange={(e)=>setSearchTerm(e.target.value)}/>
                </div>
                <div className="dropDown Inputs">
                    <label>City</label>
                    <select>
                        <option value="">Select city</option>
                        {Users.map((user: Users)=>(
                            <option id={user.id} value={user.city}>{user.city}</option>
                        ))}
                    </select>
                </div>
                <div className="checkBox">
                    <p>Highest oldest per city</p>
                <label><input type="checkbox" /> </label>
              
                </div>
            </div>
            <div className="userList">
            <div className='checkBox'>
                        <label><h2>Name</h2></label>
                        <label><h2>City</h2></label>
                        <label><h2>Birthday</h2></label>
                       
                    </div>
            {filteredUsers.map((user: Users)=>(
                <div key={user.id}>
                    <div  className='checkBox'>
                        <label>{user.firstName} {user.lastName} </label> 
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
