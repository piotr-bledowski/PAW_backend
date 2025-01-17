const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// MongoDB connection
mongoose.connect("mongodb+srv://piotrbledowski77:PPWaCo83To5v3A8Q@e-doctor-app.nm0w4.mongodb.net/?retryWrites=true&w=majority&appName=e-doctor-app")
    .then(() => {
        console.log("connected to database");

        app.listen(3000, () => {
            console.log('server is running on port 3000');
        });
    })
    .catch(() => {
        console.log("connection failed");
    });

// Absence schema and model
const absenceSchema = mongoose.Schema({
    date: {
        type: String,
        required: true,
    },
    startTime: {
        type: String,
        required: true,
    },
    endTime: {
        type: String,
        required: true,
    },
});
const Absence = mongoose.model("Absence", absenceSchema);

// Appointment schema and model
const appointmentSchema = mongoose.Schema({
    date: {
        type: String,
        required: true,
    },
    name_and_surname: {
        type: String,
        required: true,
    },
    type: {
        type: String,
        required: true,
    },
    age: {
        type: Number,
        required: true,
    },
    gender: {
        type: String,
        required: false,
    },
    startTime: {
        type: String,
        required: true,
        default: 0
    },
    endTime: {
        type: String,
        required: true,
        default: 0
    },
    additional_info: {
        type: String,
        required: false,
    },
    color: {
        type: String,
        required: false,
    }
});
const Appointment = mongoose.model("Appointment", appointmentSchema);

// Absence controllers
const getAllAbsences = async (req, res) => {
    try {
        const absences = await Absence.find();
        res.status(200).json(absences);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching absences', error });
    }
};

const getAbsenceById = async (req, res) => {
    try {
        const absence = await Absence.findById(req.params.id);
        if (!absence) return res.status(404).json({ message: 'Absence not found' });
        res.status(200).json(absence);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching absence', error });
    }
};

const createAbsence = async (req, res) => {
    try {
        const newAbsence = new Absence(req.body);
        const savedAbsence = await newAbsence.save();
        res.status(201).json(savedAbsence);
    } catch (error) {
        res.status(400).json({ message: 'Error creating absence', error });
    }
};

const updateAbsence = async (req, res) => {
    try {
        const updatedAbsence = await Absence.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true, runValidators: true }
        );
        if (!updatedAbsence) return res.status(404).json({ message: 'Absence not found' });
        res.status(200).json(updatedAbsence);
    } catch (error) {
        res.status(400).json({ message: 'Error updating absence', error });
    }
};

const deleteAbsence = async (req, res) => {
    try {
        const deletedAbsence = await Absence.findByIdAndDelete(req.params.id);
        if (!deletedAbsence) return res.status(404).json({ message: 'Absence not found' });
        res.status(200).json({ message: 'Absence deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Error deleting absence', error });
    }
};

// Appointment controllers
const getAppointments = async (req, res) => {
    try {
        const products = await Appointment.find({});
        res.status(200).json(products);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const getAppointment = async (req, res) => {
    try {
        const { id } = req.params;
        const product = await Appointment.findById(id);
        res.status(200).json(product);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const postAppointment = async (req, res) => {
    try {
        const product = await Appointment.create(req.body);
        res.status(200).json(product);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const putAppointment = async (req, res) => {
    try {
        const { id } = req.params;
        const product = await Appointment.findByIdAndUpdate(id, req.body);
        if (!product) {
            return res.status(404).json({ message: "product not found" });
        }
        const updatedProduct = await Appointment.findById(id);
        res.status(200).json(updatedProduct);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const deleteAppointment = async (req, res) => {
    try {
        const { id } = req.params;
        const product = await Appointment.findByIdAndDelete(id);
        if (!product) {
            return res.status(404).json({ message: "product not found" });
        }
        res.status(200).json("product deleted successfully");
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Absence routes
app.get('/api/absence', getAllAbsences);
app.get('/api/absence/:id', getAbsenceById);
app.post('/api/absence', createAbsence);
app.put('/api/absence/:id', updateAbsence);
app.delete('/api/absence/:id', deleteAbsence);

// Appointment routes
app.get('/api/appointments', getAppointments);
app.get('/api/appointments/:id', getAppointment);
app.post('/api/appointments', postAppointment);
app.put('/api/appointments/:id', putAppointment);
app.delete('/api/appointments/:id', deleteAppointment);

// Root route
app.get('/', (req, res) => {
    res.send('Hello from node api server');
});
