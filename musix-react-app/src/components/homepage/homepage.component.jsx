import React from 'react';
import Button from '@material-ui/core/Button';
import Tooltip from '@material-ui/core/Tooltip';
import { Route, Link, Switch, Redirect } from 'react-router-dom';
import axios from 'axios';

import './homepage.styles.css';
import Search from '../search/search.component';
import Recommendations from '../recommendations/recommendations.component';


class HomePage extends React.Component {
    constructor(props){
        super(props);
        this.state = {
            recommendations: [],
            searchStatus:'hold'
        }
    }

    componentDidMount(){
        if (localStorage.getItem('userid')){
            this.setState({searchStatus:'loading'}, () => {
                let recommendations = [];
                let params = {user_id: localStorage.getItem('userid'), Authorization: `Bearer ${localStorage.getItem('Token')}`};
                axios.get('http://localhost:8080/albums/getalbums', {params})
                .then(data => {
                    return JSON.parse(data.request.response);
                }).then(recs => {
                    recommendations = recs;
                }).catch((err)=>{
                    console.log(err)
                }).finally(() => {
                    if (recommendations.length > 0) {
                        this.setState({recommendations:recommendations, searchStatus:'complete'})
                    } else {
                        this.setState({searchStatus:'none'})
                    }
                })
            })
        }
    }

    getRecommendations = () => {
        const userId = localStorage.getItem('userid');
        const token = localStorage.getItem('Token');
        let recommendations = [];
        axios.get('http://localhost:8080/albums/getalbums', {params: {user_id: userId, Authorization: `Bearer ${token}`}})
        .then(data => {
            return JSON.parse(data.request.response);
        }).then(recs => {
            recommendations = recs;
        }).catch((err)=>{
            console.log(err)
        }).finally(() => {
            if (recommendations.length > 0) {
                this.setState({recommendations:recommendations, searchStatus:'complete'})
            } else {
                this.setState({recommendations:recommendations, searchStatus:'none'})
            }
        })
    }

    recommend = (a) => {
        let album = {
            albumName: a.albumName,
            artist: a.artist,
            imgUrl: a.imgUrl
        }
        const userId = localStorage.getItem('userid');
        const token = localStorage.getItem('Token');
        axios.post('http://localhost:8080/albums/addalbum',album,{params: {user_id: userId, Authorization: `Bearer ${token}`}})
        .then(() => {
            this.getRecommendations();
        }).catch(err => {
            console.log(err);
        })
    }

    unrecommend = (albumId) => {
        const userId = localStorage.getItem('userid');
        const token = localStorage.getItem('Token');
        axios.delete(`http://localhost:8080/albums/delete/${albumId}`,{params: {user_id: userId, Authorization: `Bearer ${token}`}})
        .then(() => {
            this.getRecommendations();
        }).catch(err => {
            console.log(err);
        })
    }

    render(){
        return (
            <div className='home-page'>
                <ul className="actions">
                    <li>
                        <Button component={Link} to='/app/search' variant="contained" color="primary">Search Albums</Button>
                    </li>
                    <li>
                        <Tooltip enterDelay={100} title={this.props.isLoggedIn ? '' : 'Login to view your recommendations'} >
                            <div>
                                <Button disabled={!this.props.isLoggedIn} component={Link} to='/app/recommendations' variant="contained" color="primary">
                                    Recommendations
                                </Button>
                            </div>
                        </Tooltip>
                        
                    </li>
                </ul>
                <Switch>
                    <Route exact path='/app/search' >
                        <Search 
                            isLoggedIn={this.props.isLoggedIn} 
                            recommendations={this.state.recommendations} 
                            recommend={this.recommend}
                            unrecommend={this.unrecommend}
                        />
                    </Route>
                    <Route exact path='/app/recommendations'>
                        {this.props.isLoggedIn ? (
                            <Recommendations 
                                isLoggedIn={this.props.isLoggedIn} 
                                recommendations={this.state.recommendations} 
                                getRecommendations={this.getRecommendations}
                                searchStatus={this.state.searchStatus}
                                recommend={this.recommend}
                                unrecommend={this.unrecommend}
                            />
                        ) : (
                            <Redirect to={{ pathname: "/app" }}/>
                        )}
                        
                    </Route>
                    <Route exact path='/app/*'>
                        <Redirect to='/app' />
                    </Route>
                </Switch>
                
            </div>
        )
    }
}

export default HomePage;