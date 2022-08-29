import axios from "axios";
import { API } from "../constant.js";
import * as yup from "yup";

const headers = {
  "Access-Control-Allow-Origin": "*",
  "Content-Type": "application/json",
};

let sessionSchema = yup.object().shape({
  name: yup.string().required("Session name is required"),
  id: yup
    .string()
    .uuid()
    .required("Session id is required. Please refresh the page and try again."),
  questions: yup
    .array()
    // .length()
    .of(
      yup.object().shape({
        question: yup.string().required("Question text is required"),
        order: yup
          .number()
          .required(
            "Question order is required. Please refresh the page and try again."
          ),
      })
    ).min(1, "At least one question is required"),
});

const idSchema = yup.object().shape({
  id: yup
    .string()
    .uuid()
    .required("Session id is required. Please refresh the page and try again."),
});

export const getAllSessions = async () => {
  return await axios.get(`${API}/session/getAll`, {}, { headers });
};

export const createSession = async (data) => {
  await sessionSchema.validate(data);
  return await axios.post(`${API}/session/create`, data, { headers });
};

export const updateSession = async (data) => {
  await sessionSchema.validate(data);
  return await axios.post(`${API}/session/update`, data, { headers });
};

export const deleteSession = async (data) => {
  await idSchema.validate(data);
  return await axios.post(`${API}/session/delete`, data, { headers });
};

export const restoreDb = async () => {
  return await axios.post(`${API}/restoreDb`, {}, { headers });
};
