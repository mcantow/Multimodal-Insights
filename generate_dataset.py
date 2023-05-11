import random
import json

def makeSalesData(people, NUM_DAYS = 120):
    salesData = {
        person[0]+str(person[1]):{
            'customer-conversations':[],
            'revenue':[],
            'completed-sales':[],
            'win-rate':[]
        } for person in people
    }
    for person in people:
        customer_conversations, revenue, completed_sales, win_rate = [], [], [], []
        person_key = person[0]+str(person[1])
        for d in range(NUM_DAYS):
            customer_conversations.append(random.randint(10,50))
            completed_sales.append(round(customer_conversations[d]*random.randint(25,100)/100)) # got a fraction completed
            win_rate.append(round(completed_sales[d]/customer_conversations[d], 2))
            revenue.append(completed_sales[d] *random.randint(100,175))
        salesData[person_key]['customer-conversations'] = customer_conversations
        salesData[person_key]['completed-sales'] = completed_sales
        salesData[person_key]['win-rate'] = win_rate
        salesData[person_key]['revenue'] = revenue
    return salesData

if __name__ == '__main__':
    ## dataset 1
    # peopleList = ['john', 'janice', 'jessica', 'jeff', 'josie', 'john']
    # peopleCounts = [0,      0,        0,         0,      0     ,  1    ]
    # dataset 2
    peopleList = ['don', 'joanna', 'don', 'joanna', 'don']
    peopleCounts = [0,      0,        1,     1     ,  2    ]
    people = list(zip(peopleList, peopleCounts))
    salesData = makeSalesData(people)
    salesDataJSON = json.dumps(salesData)
    # with open("salesData.txt", "w") as text_file:
    with open("salesData2.txt", "w") as text_file:
        text_file.write(salesDataJSON)