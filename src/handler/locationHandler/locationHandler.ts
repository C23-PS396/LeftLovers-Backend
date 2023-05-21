import { Request, Response } from "express";
import axios from "axios";
import db from "../../../config/db";
import { GO_API_KEY, GO_API_URL } from "../../../config/config";

export const registerLocation = async (req: Request, res: Response) => {
  const { province, regency, district, village, fullLocation } = req.body;

  db.location
    .create({
      data: {
        province,
        regency,
        district,
        village,
        fullLocation,
      },
    })
    .then((location) => {
      return res.status(201).send({
        message: "Location has sucefully registered",
        location,
      });
    })
    .catch((err: Error) => {
      return res.status(5000).send({ message: err });
    });
};

export const getProvince = async (_req: Request, res: Response) => {
  const url = `${GO_API_URL}/regional/provinsi`;

  const params = {
    api_key: GO_API_KEY,
  };

  try {
    const response = await axios.get(url, { params });

    res.status(response.status).send(response.data);
  } catch (err) {
    return res.send(err);
  }
};

export const getRegency = async (req: Request, res: Response) => {
  const { province_id } = req.query;
  const url = `${GO_API_URL}/regional/kota`;

  const params = {
    api_key: GO_API_KEY,
    provinsi_id: province_id,
  };

  try {
    const response = await axios.get(url, { params });

    res.status(response.status).send(response.data);
  } catch (err) {
    return res.send(err);
  }
};

export const getDistrict = async (req: Request, res: Response) => {
  const { regency_id } = req.query;
  const url = `${GO_API_URL}/regional/kecamatan`;

  const params = {
    api_key: GO_API_KEY,
    kota_id: regency_id,
  };

  try {
    const response = await axios.get(url, { params });

    res.status(response.status).send(response.data);
  } catch (err) {
    return res.send(err);
  }
};

export const getVillage = async (req: Request, res: Response) => {
  const { district_id } = req.query;
  const url = `${GO_API_URL}/regional/kelurahan`;

  const params = {
    api_key: GO_API_KEY,
    kecamatan_id: district_id,
  };

  try {
    const response = await axios.get(url, { params });

    res.status(response.status).send(response.data);
  } catch (err) {
    return res.send(err);
  }
};
