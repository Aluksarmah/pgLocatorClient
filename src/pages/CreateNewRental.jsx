import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faWifi, faTv, faPaw, faDoorClosed, faCarSide, faCloudArrowUp, faTrash } from "@fortawesome/free-solid-svg-icons"
import { useForm } from "react-hook-form"
import axios from "axios"
import { useContext, useState } from "react"
import { UserContext } from "../UserContext"
import ErrorMessages from "../components/ErrorMessages"

function CreateNewRental() {

    //using context to get user info
    //userInfo._id will be used to identify the user when a new listing is created
    const { userInfo } = useContext(UserContext)

    //using react hook form for validation
    //giving maxGuests a default value of 1
    const { register, handleSubmit, formState: { errors } } = useForm({
        defaultValues: {
            maxGuests: 1
        }
    })

    //toggle for canceling form
    const [ cancelForm, setCancelForm ] = useState(false)

    //state variable tracking all images currently queued for upload by user. 
    //These have not been submitted yet, but they will be displayed in the photo gallery below the photos section.
    //this is the final array of images that will be sent to the server after user submits the form.
    const [ imageQueue, setImageQueue ] = useState([])

    //state variables for tracking image links submitted by user
    //this is tracking individual links being submitted by the user. After submission and successful download serverside, these links are added to imageQueue variable for being sent to the server and then stored in mongodb.
    const [ imageLink, setImageLink ] = useState('')

    //function to handle adding images that were submiited through a link
    function addLinkImages(e){
        e.preventDefault()
        axios.post("https://pglocator-server.vercel.app/listings/uploadimage-link",
            { imageLink }
        )
        .then(res => {
            //server responds with name of file
            const fileName = res.data

            //add filename to current queue
            setImageQueue(prev => [ ...prev, fileName ])
            
            //set image link input back to empty after successful upload
            setImageLink('')
        })
        .catch(err => console.log('Error while downloading image from link',err))
    }

    //function to handle images loaded through devices
    async function addDeviceImages(e){
        const images = e.target.files
        const data = new FormData()

        for(let i = 0; i < images.length; i++){
            data.append('images', images[i])
        }

        axios.post("https://pglocator-server.vercel.app/listings/uploadimage-device", 
            data,
            {
                headers: { "Content-Type": "multipart/form-data" }
            }
        )
        .then(res => {
            //server will respond with file name of uploaded files. 
            //we can add them to our Image queue using the spread operator as we might be receiving multiple files together.
            const fileNames = res.data
            
            setImageQueue(prev => {
                return [...prev, ...fileNames]
            })
        })
        .catch(err => console.log('Error while uploading image from device',err))
    }

    //function for deleting photos from photo gallery
    function deletePhoto(photo){
        setImageQueue(imageQueue.filter(pic => pic !== photo))
    }

    //function for submitting data using react-hook-form
    function submitData(data){
        axios.post("https://pglocator-server.vercel.app/listings/new",
            {
                id: userInfo._id,
                data,
                imageQueue
            }
        )
        .then(res => {
            //if we get a successful response, we can navigate the user to their rentals page.
            if(res.data){
                window.location.replace('http://localhost:5173/account/rentals')
            }
        })
        .catch(err => console.log(err))
    }

    return (
        <div
            className="flex flex-col items-center border p-3 rounded-lg pb-36 sm:pb-5"
        >
            <h1
                className="text-3xl mb-5"
            >
                Add a new Pg
            </h1>

            {/* form for creating a new listing to rent out */}            
            <form 
                className="w-full"
                onSubmit={handleSubmit(submitData)}
            >   
                <div
                    className="flex flex-col sm:flex-row items-center justify-center"
                >
                    <label className="mr-3">Title</label>
                    <input 
                        {...register("title", { required: true, maxLength: 200 })}
                        className="w-full border-2 border-sky-300 p-2 rounded-lg"
                        type="text"
                        placeholder="ex: My perfect pg/rental" 
                    />
                </div>
                {errors.title && (
                    <div>
                        {errors.title.type === "required" && <ErrorMessages message={'Title is required'} />}
                        {errors.title.type === "maxLength" && <ErrorMessages message={"Title cannot be longer than 200 characters"} />}
                    </div>
                )}
                
                <div
                    className="flex flex-col sm:flex-row items-center justify-center mt-2" 
                >
                    <label className="mr-3">Price</label>
                    <input 
                        {...register("price", { required: true })}
                        className="w-full border-2 border-sky-300 p-2 rounded-lg"
                        type="number"
                        placeholder="ex: 5000 per month" 
                    />
                </div>
                {errors.price && (
                    <div>
                        {errors.price.type === "required" && <ErrorMessages message={'Price is required'}/>}
                    </div>
                )}
            
                <div
                    className="flex flex-col sm:flex-row items-center justify-center mt-2"
                >
                    <label className="mr-3">Location</label>
                    <input 
                        {...register("location", { required: true })}
                        className="w-full border-2 border-sky-300 p-2 rounded-lg"
                        type="text"
                        placeholder="Enter the location of your pg" 
                    />
                </div>
                {errors.location && (
                    <div>
                        {errors.location.type === "required" && <ErrorMessages message={'Location is required'}/>}
                    </div>
                )}

                <div
                    className="flex flex-col sm:flex-row items-center justify-center mt-2"
                >
                    <label className="mr-3">Description</label>
                    <textarea
                        {...register("description", { required: true, maxLength: 2000 })}
                        className="w-full border-2 p-2 border-sky-300 rounded-lg"
                        type="text"
                        placeholder="A brief description of your pg" 
                        rows={5}
                    />
                </div>
                {errors.description && (
                    <div>
                        {errors.description.type === "required" && <ErrorMessages message={'Description is required'}/>}
                        {errors.description.type === "maxLength" && <ErrorMessages message={'Description cannot be more than 2000 characters'}/>}
                    </div>
                )}

                <div
                    className="flex flex-col sm:flex-row items-center justify-center mt-2" 
                >
                    <label className="mr-3">Additional Information</label>
                    <textarea
                        {...register("extraInfo", { maxLength: 1000 })}
                        className="w-full border-2 border-sky-300 p-2 rounded-lg"
                        type="text"
                        placeholder="Any additional information for guests. Ex: pg rules, check-in procedure etc" 
                        rows={4}
                    />
                </div>
                {errors.extraInfo && (
                    <div>
                        {errors.extraInfo.type === "maxLength" && <ErrorMessages message={'Additional Information cannot be more than 1000 characters'}/>}
                    </div>
                )}

                {/* amenities checkboxes */}
                
                <h4 className="text-lg text-center sm:text-left mt-2">Amenities</h4>
                
                <div
                    className="flex items-center justify-center flex-wrap border-2 border-sky-300 mt-2 p-3 rounded-lg" 
                >
                    <div 
                        className="flex items-center justify-center border-2 p-2 rounded-md cursor-pointer m-2"
                    >
                        <input 
                            {...register("checkbox")}
                            type="checkbox"
                            value="WiFi"  
                            className="m-2"
                        />
                        <FontAwesomeIcon 
                            icon={faWifi} 
                            style={{ margin:'8px' }}
                        /> WiFi
                    </div>

                    <div
                        className="flex items-center justify-center border-2 p-2 rounded-md cursor-pointer m-2"
                    >
                        <input 
                            {...register("checkbox")}
                            type="checkbox"
                            className="m-2"
                            value="TV"    
                        />
                        <FontAwesomeIcon 
                            icon={faTv} 
                            style={{ margin:'8px' }}
                        /> TV
                    </div>

                    <div
                        className="flex items-center justify-center border-2 p-2 rounded-md cursor-pointer m-2"
                    >
                        <input 
                            {...register("checkbox")}
                            type="checkbox"
                            className="m-2"  
                            value="Pets Allowed"   
                        />
                        <FontAwesomeIcon 
                            icon={faPaw} 
                            style={{ margin:'8px' }}    
                        /> Pets Allowed
                    </div>

                    <div
                        className="flex items-center justify-center border-2 p-2 rounded-md cursor-pointer m-2"
                    >
                        <input 
                            {...register("checkbox")}
                            type="checkbox"
                            className="m-2" 
                            value="Private Entrance"    
                        />
                        <FontAwesomeIcon 
                            icon={faDoorClosed} 
                            style={{ margin:'8px' }}
                        /> Private Entrance
                    </div>

                    <div
                        className="flex items-center justify-center border-2 p-2 rounded-md cursor-pointer m-2"
                    >
                        <input
                            {...register("checkbox")} 
                            type="checkbox"
                            className="m-2" 
                            value="Free Parking Spot"    
                        />
                        <FontAwesomeIcon 
                            icon={faCarSide} 
                            style={{ margin:'8px' }}
                        /> Free Parking Spot
                    </div>
                </div>

                <div
                    className="flex flex-col sm:flex-row items-center justify-between mt-2 w-full"
                >
                    <label>Vacant seats available</label>
                    <input 
                        {...register("maxGuests", { required: true, min: 1 })}
                        className="border-2 border-sky-300 p-2 rounded-lg"
                        type="number" 
                    />
                </div>
                {errors.maxGuests && (
                    <div>
                        {errors.maxGuests.type === "required" && <ErrorMessages message={'Number of guests is required'}/>}
                        {errors.maxGuests.type === "min" && <ErrorMessages message={'Number of guests cannot be less than 1'}/>}
                    </div>
                )}
            
                <h4 className="text-lg text-center sm:text-left mt-2">Photos</h4>
                <p
                    className="text-sm text-stone-400 my-1"
                >
                    You can upload photos by using a link to a image hosting website or directly from your device!
                </p>
                
                {/* add photos section */}
                <div
                    className="flex justify-between"
                >
                    {/* add images through a url */}
                    <input 
                        name="uploadimages-link"
                        className="sm:w-4/5 border-2 border-sky-300 p-2 rounded-lg"
                        type="text"
                        value={imageLink}
                        onChange={e => setImageLink(e.target.value)}
                        placeholder="Upload photos with a link" 
                    />

                    <button
                        type="button"
                        className="bg-red text-white text-lg py-2 px-4 rounded-full my-2"
                        onClick={addLinkImages}
                    >
                        Add photo
                    </button>
                </div>
            
                {/* gallery for displaying images queued up to be added to the listing by user */}
                <div
                    className="mt-3 flex flex-wrap border-2 border-sky-300 p-3 rounded-md"
                >
                    {/* calling the saved files from our server if they have been uploaded already. if no images have been placed in the queue, a simple "add photos" will be displayed */}
                    {/* server has a static folder with all uploaded images available at route /uploads/file-name.jpg */}
                    {imageQueue.length > 0 && imageQueue.map(photo => 
                        <div 
                            key={photo}
                            className="flex relative"
                        >
                            <img
                                className="max-w-[300px] max-h-[300px] rounded-xl m-1"
                                src={`http://localhost:5173/uploads/${photo}`}
                                alt="uploaded image"
                            />

                            {/* option to delete added photos */}
                            <div
                                className="absolute bottom-2 right-2 bg-white p-1 rounded-full flex items-center cursor-pointer"
                                onClick={() => deletePhoto(photo)}
                            >
                                <FontAwesomeIcon icon={faTrash} style={{color: "#f00000", height:"20px", width:"20px"}} />
                            </div>
                        </div>
                    )}

                    {/* upload images from device */}
                    <label
                        className="border-2 border-fuchsia-400 rounded-xl p-2 flex items-center gap-2 font-roboto font-semibold cursor-pointer text-stone-500 m-1"
                    >
                        <FontAwesomeIcon 
                            icon={faCloudArrowUp} 
                            style={{height:'40px', width:'40px', color:'skyblue'}}
                        />
                        Upload images from your device
                        <input 
                            multiple
                            className="hidden"
                            type="file" 
                            onChange={addDeviceImages}
                        />
                    </label>
                </div>
                
                {/* Save or cancel the form */}
                <div
                    className="flex items-center justify-evenly mt-8"
                >
                    <button 
                        type="submit"
                        className="bg-red text-white text-2xl py-2 px-4 rounded-full self-center"    
                    >
                        Save
                    </button>

                    <button 
                        type="button"
                        className="bg-sky-300 text-white text-2xl py-2 px-4 rounded-full self-center" 
                        onClick={() => setCancelForm(!cancelForm)}   
                    >
                        Cancel
                    </button>
                </div>
            </form>

            {cancelForm && (
                /* confirmation before cancelling form */
                <div
                    className="mt-3 bg-stone-300 p-5 rounded-lg"
                >
                    <p 
                        className="text-lg"
                    >
                        Are you sure you want to cancel your form submission?
                    </p>

                    <div
                        className="flex items-center justify-evenly mt-2"
                    >
                        {/* on yes click, renavigate to rentals subpage */}
                        <button 
                            className="bg-red p-2 rounded-lg text-white"
                            onClick={() => window.location.assign('/account/rentals')}
                        >
                            Yes
                        </button>

                        {/* on no click, close modal */}
                        <button 
                            className="bg-sky-300 p-2 rounded-lg text-white"
                            onClick={() => setCancelForm(!cancelForm)}
                        >
                            No
                        </button>
                    </div>
                </div>
            )}
        </div>
    )
}

export default CreateNewRental