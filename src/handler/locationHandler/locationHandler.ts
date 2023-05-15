import { Request, Response } from "express";
import { Location } from "../../models";
import { go_api_key, go_api_url } from "../../../config/config";
import axios from "axios";

export const registerLocation = (req: Request, res: Response) => {
  const { province, regency, district, village, fullLocation } = req.body;

  Location.create({
    province,
    regency,
    district,
    village,
    fullLocation,
  })
    .then((location) => {
      return res.status(201).send({
        message: "Location has sucefully registered",
        location,
      });
    })
    .catch((err: Error) => {
      return res.status(500).send({
        message: err,
      });
    });
};

export const getProvince = async (_req: Request, res: Response) => {
  const url = `${go_api_url}/regional/provinsi`;

  const params = {
    api_key: go_api_key,
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
  const url = `${go_api_url}/regional/kota`;

  const params = {
    api_key: go_api_key,
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
  const url = `${go_api_url}/regional/kecamatan`;

  const params = {
    api_key: go_api_key,
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
  const url = `${go_api_url}/regional/kelurahan`;

  const params = {
    api_key: go_api_key,
    kecamatan_id: district_id,
  };

  try {
    const response = await axios.get(url, { params });

    res.status(response.status).send(response.data);
  } catch (err) {
    return res.send(err);
  }
};
