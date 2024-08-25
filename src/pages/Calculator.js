import React, { useState } from 'react';
import styles from '../styles/Calculator.module.css';

function Calculator() {
    const [age, setAge] = useState(21);
    const [height, setHeight] = useState(180);
    const [weight, setWeight] = useState(65);
    const [gender, setGender] = useState('male');
    const [activity, setActivity] = useState('option1');
    const [tdee, setTdee] = useState(null);

    const calculateBMR = () => {
        let BMR = gender === "male" 
            ? 10 * weight + 6.25 * height - 5 * age + 5 // executed if checked gender is male
            : 10 * weight + 6.25 * height - 5 * age - 161; // executed if checked gender is not male, ie female
        
        let activityMultiplier;
        switch (activity) {
            case "option1": activityMultiplier = 1.2; break;
            case "option2": activityMultiplier = 1.375; break;
            case "option3": activityMultiplier = 1.55; break;
            case "option4": activityMultiplier = 1.725; break;
            case "option5": activityMultiplier = 1.9; break;
            default: activityMultiplier = 1.2;
        }

        setTdee(Math.round(BMR * activityMultiplier));
    };

    return (
        <div>
            <div className = {styles['tdee-calculator']}>
                <h2>TDEE Calculator</h2>
                <div className="controls">
                    <form onSubmit={e => e.preventDefault()}>
                        <div className="age">
                            <h3>Age</h3>
                            <input type="text" id="age" value={age} onChange={e => setAge(e.target.value)} />
                        </div>
                        <div className={styles.gender}>
                            <h3>Gender</h3>
                            <input type="radio" id="male" value="male" name="gender" checked={gender === 'male'} onChange={e => setGender(e.target.value)} />
                            <label htmlFor="male">Male</label> 
                            <input type="radio" id="female" value="female" name="gender" checked={gender === 'female'} onChange={e => setGender(e.target.value)} />
                            <label htmlFor="female">Female</label> 
                        </div>
                        <div className= {styles.height}>
                            <h3>Height</h3>
                            <input type="text" id="height" value={height} onChange={e => setHeight(e.target.value)} />
                            <div className={styles.unit}>cm</div>
                        </div>
                        <div className= {styles.height}>
                            <h3>Weight</h3>
                            <input type="text" id="weight" value={weight} onChange={e => setWeight(e.target.value)} />
                            <div className={styles.unit}>kg</div>
                        </div>
                        <div className= {styles.activity}>
                            <h3>Activity</h3>
                            <label htmlFor="activity-dropdown">Select Activity Level</label>
                            <select id="activity-dropdown" value={activity} onChange={e => setActivity(e.target.value)}>
                                <option value="option1">Sedentary</option>
                                <option value="option2">Light Exercise (1-2 days/week )</option>
                                <option value="option3">Moderate Exercise (3-5 days/week)</option>
                                <option value="option4">Heavy Exercise (6-7 days/week)</option>
                                <option value="option5">Athlete (2x per day) or physical job</option>
                            </select>
                        </div>
                    </form>
                </div>
                <div className={styles.result}>
                    <button className= {styles['calculate-btn']} onClick={calculateBMR}>Calculate</button>
                    <div className="result-message">
                        {tdee && <span className="calories">{tdee}</span>} Calories/day
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Calculator;
