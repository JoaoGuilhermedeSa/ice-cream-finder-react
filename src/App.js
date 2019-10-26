import React, { Component } from 'react';
import styles from './App.css';

class App extends Component {


    state = {
        places: null,
        total: null,
        per_page: null,
        current_page: 0
    }


    componentDidMount() {
        this.makeHttpRequestWithPage(0);
    }


    makeHttpRequestWithPage = async pageNumber => {
        const response = await fetch(`http://localhost:3100/api/ice-cream?limit=3&offset=${pageNumber}`, {
            method: 'GET',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            },
        });

        const data = await response.json();

        this.setState({
            places: data.businesses,
            total: data.total,
            per_page: 3,
            current_page: pageNumber
        });
    }

    getLocationCategories = categories => {
        return categories.map(category => category.title).join(', ');
    }

    reviews = revs => {
        if (revs!==null&&this.state.places!==null){
        return revs.map(review =>
            (<div className="review">
                <div className="user-rating"> <b>{review.rating}</b> </div>
                <div> <i>"{review.text}"</i> </div>
                <div> <a href={review.user.profile_url}>{review.user.name}</a> - {review.time_created} </div>
                <div> <a href={review.url}>Read full review</a></div>
            </div>
            ));
        }
    }

    render() {

        let places, renderPageNumbers;

        if (this.state.places !== null) {
            places = this.state.places.map(place => {
                return (
                    <div key={place.id} className="location">
                        <div className="rating">
                            <span className="top"><b><i>{place.is_closed ? 'Closed' : 'Open'}</i></b></span>
                            <span><i>{place.transactions.join(", ")}</i></span>
                            <span className="bottom"><p><b>{place.rating}</b>{" (" + place.review_count} reviews)</p></span>
                        </div>
                        <div className="parent">
                            <div className="image"> <img src={place.image_url} alt={place.name} /></div>
                            <div>
                                <div><a href={place.url}><b>{place.name}</b></a></div>
                                <div>Phone: {place.phone}</div>
                                <div>Categories: {this.getLocationCategories(place.categories)}</div>
                                <div>Addresses: {place.location.display_address.join(", ")}</div>
                            </div>
                        </div>
                        <div className="reviews">{this.reviews(place.reviews)}</div>
                    </div>);
            });
        }

        const pageNumbers = [];
        if (this.state.total !== null) {
            for (let i = 1; i <= Math.ceil(this.state.total / this.state.per_page); i++) {
                pageNumbers.push(i);
            }
        }

        renderPageNumbers = pageNumbers.map(number => {
            if (number == 1 || number == this.state.total - 1 || (number >= this.state.current_page - 2 && number <= this.state.current_page + 2)) {
                return (<button key={number} className={number - 1 == this.state.current_page ? "active" : "button"} onClick={
                    () => this.makeHttpRequestWithPage(number - 1)
                } > {number} </button>
                );
            }
        });

        return (<div className="content">
            {places}
            <div className="pagination">
                <button className={this.state.current_page == 0 ? 'hidden' : 'button'} onClick={() => this.makeHttpRequestWithPage(this.state.current_page - 1)}> &laquo; </button>
                {renderPageNumbers}
                <button className={this.state.current_page == this.state.total - 1 ? 'hidden' : 'button'} onClick={() => this.makeHttpRequestWithPage(this.state.current_page + 1)}> &raquo;
                    </button>
            </div>
            <div className="pagination">{((this.state.current_page + 1) * 3) - 2} - {((this.state.current_page + 1) * 3)} of {this.state.total}</div>
        </div >
        );
    }

}

export default App; 