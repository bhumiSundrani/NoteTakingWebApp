import React from "react";
import { Editor } from "@tinymce/tinymce-react";
import {Controller} from 'react-hook-form'

const RTE = ({ value,  name, label, control}) => {
  const apiKey = import.meta.env.VITE_TINYMCE_API_KEY
  return (
    <div>
      <label htmlFor="description" className="block sm:text-lg font-medium text-[15px]">{label}</label>
      <Controller
      name={name}
      control={control}
      defaultValue=""
      render={({field: {onChange, value}}) => (
      <Editor
        apiKey={apiKey} // Replace with your TinyMCE API key
        value={value}        
        onEditorChange={onChange}
        init={{
          height: 500,
          menubar: true,
          plugins: 
            "lists advlist autolink link image charmap preview anchor searchreplace visualblocks code fullscreen insertdatetime media wordcount emoticons",
          toolbar:
            "undo redo | formatselect | bold italic underline strikethrough | \
             bullist numlist | alignleft aligncenter alignright alignjustify | \
             outdent indent | link | table emoticons | fullscreen code preview",
          content_style: "body { font-family: Arial, sans-serif; font-size: 14px; }",
          branding: false
        }}
      />)}
      >        
      </Controller>
    </div>
    
  );
};

export default RTE;
