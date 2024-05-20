/* eslint-disable @next/next/no-img-element */
'use client'
import { useSession } from 'next-auth/react';
import React, { useEffect, useRef, useState } from 'react'
import { HiOutlinePhotograph } from 'react-icons/hi'
// ^firebase imports
import app from '@/firebase';
import { getStorage, ref, uploadBytesResumable, getDownloadUrl, getDownloadURL } from 'firebase/storage'
import { Timestamp, addDoc, collection, getFirestore, serverTimestamp } from "firebase/firestore"


const Input = () => {

  const { data: session } = useSession();
  // ! we generally do this 
  // ?1️⃣ selectedFile state is used to store the actual file data (File object) of the selected image
  const [selectedFile, setSelectedFile] = useState(null);
  // ?2️⃣ imageFileUrl state could be used to store additional metadata or information about the selected file,
  // ?such as its name or a temporary URL for previewing the image

  const [imageFileUrl, setImageFileUrl] = useState(null);


  const [imageFileUploading, setImageFileUploading] = useState(false);
  const [text, setText] = useState('');
  const [postLoading, setPostLoading] = useState(false);
  const imagePickRef = useRef(null);
  const db = getFirestore(app)

  const addImageToPost = (e) => {
    const file = e.target.files[0]
    if (file) {
      setSelectedFile(file)
      setImageFileUrl(URL.createObjectURL(file))
    }
  }

  useEffect(() => {
    if (selectedFile) {
      uploadImageToStorage()
    }
  }, [selectedFile])

  const uploadImageToStorage = () => {
    setImageFileUploading(true);
    const storage = getStorage(app);
    const fileName = new Date().getTime() + '-' + selectedFile.name;
    const storageRef = ref(storage, fileName);
    const uploadTask = uploadBytesResumable(storageRef, selectedFile);
    uploadTask.on(
      'state_changed',
      (snapshot) => {
        const progress =
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        console.log('Upload is ' + progress + '% done');
      },
      (error) => {
        console.log(error);
        setImageFileUploading(false);
        setImageFileUrl(null);
        setSelectedFile(null);
      },

      () => {
        getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
          setImageFileUrl(downloadURL);
          setImageFileUploading(false);
        });
      }
    );
  };


  const handleSubmit = () => {
    setPostLoading(true);
    const docRef = addDoc(collection(db, 'posts'), {
      uid: session.user.uid,
      name: session.user.name,
      username: session.user.username,
      text,
      profileImg: session.user.image,
      Timestamp: serverTimestamp()
    })
    setPostLoading(false)
    setText('');
    setImageFileUrl(null);
    setSelectedFile(null);
  }


  if (!session) return null;

  return (
    <div className='flex border-b border-gray-200 p-3 space-x-3 w-full'>
      <img
        src={session.user.image}
        alt='user-img'
        className='h-11 w-11 rounded-full cursor-pointer hover:brightness-95'
      />
      <div className="w-full divide-y divide-gray-200">
        <textarea className='w-full border-none outline-none tracking-wide min-h-[50px] text-gray-700' placeholder='Whats happening'
          value={text}
          onChange={(e) => setText(e.target.value)}
          rows='2'></textarea>
        {
          selectedFile && (
            <img src={imageFileUrl} alt="image"className={`w-full max-h-[250px] object-cover cursor-pointer
            ${imageFileUploading ? 'animate-pulse' : ''}`}/>
          )
        }
        <div className="flex items-center justify-between pt-2.5">
          <HiOutlinePhotograph
            className='h-10 w-10 p-2 text-sky-500 hover:bg-sky-100 rounded-full cursor-pointer'
            onClick={() => imagePickRef.current.click()} />
          <input type="file" ref={imagePickRef} accept='image/*' onChange={addImageToPost} hidden />

          <button disabled={text.trim() === '' || postLoading || imageFileUploading} className='bg-blue-400 text-white px-4 py-1.5 rounded-full font-bold  shadow-md hover:brightness-95 disabled:opacity-50' onClick={handleSubmit}> Post</button>
        </div>
      </div>
    </div>
  )
}

export default Input



//? onClick={() => imagePickRef.current.click()} is used to programmatically trigger the file picker dialog when a specific element is clicked. Here's what it does:

//! imagePickRef.current refers to the actual DOM element that the ref is attached to, which is the <input type="file"> element in this case.
// !.click() is a method that simulates a click event on the DOM element.
// !By calling imagePickRef.current.click(), you're effectively triggering a click event on the file input element, which opens the file picker dialog for the user.
// !The onClick event handler is typically attached to another element, like a button or an icon, so that when the user clicks on that element, the file picker dialog opens.